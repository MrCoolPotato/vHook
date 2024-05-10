const OpenAI = require("openai");
const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { chunkMessage } = require("../utils");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const languageOptions = [
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
  { label: "German", value: "German" },
  { label: "Japanese", value: "Japanese" },
  { label: "Chinese (Simplified)", value: "Simplified Chinese" },
  { label: "Russian", value: "Russian" },
];

async function translateWithOpenAI(interaction) {
  const message = interaction.targetMessage;
  const customId = `select-language-${message.id}`;

  console.log(`Creating select menu with custom ID: ${customId}`);

  const row = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder("Select a target language")
      .addOptions(languageOptions)
  );

  await interaction.editReply({
    content: "Select the target language for translation:",
    components: [row],
    ephemeral: true,
  });
}

async function handleLanguageSelection(interaction) {
  try {
    const customIdParts = interaction.customId.split("-");
    console.log(`Custom ID Parts: ${JSON.stringify(customIdParts)}`);

    if (customIdParts[0] !== "select" || customIdParts[1] !== "language") {
      console.log("Custom ID does not match 'select-language'.");
      return;
    }

    const messageId = customIdParts.slice(2).join("-");
    console.log(`Message ID: ${messageId}`);

    const targetLanguage = interaction.values[0];
    console.log(`Selected target language: ${targetLanguage}`);

    await interaction.deferReply({ ephemeral: true });

    const message = await interaction.channel.messages.fetch(messageId);
    console.log(`Fetched message for translation: "${message.content}"`);

    const systemMessage = {
      role: "system",
      content:
        "You are a helpful assistant powered by a LLM. Translate any text you receive to the specified target language. Only provide the translation, not the original text, and do not comment on anything else.",
    };

    const userMessage = {
      role: "user",
      content: `Translate the following message to ${targetLanguage}: "${message.content}"`,
    };

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [systemMessage, userMessage],
    });

    const responseContent = chatCompletion.choices[0].message.content;
    console.log(`Translation response: ${responseContent}`);

    const responseChunks = chunkMessage(
      `Translation to ${targetLanguage}: ${responseContent}`
    );

    await interaction.editReply({
      content: responseChunks[0],
      components: [],
      ephemeral: true,
    });

    for (let i = 1; i < responseChunks.length; i++) {
      await interaction.followUp({
        content: responseChunks[i],
        ephemeral: true,
      });
    }
  } catch (error) {
    console.error(`Error while handling language selection: ${error}`);
    try {
      await interaction.editReply({
        content:
          "Sorry, I encountered an error trying to process your translation request.",
        components: [],
        ephemeral: true,
      });
    } catch (updateError) {
      console.error(`Error updating the interaction: ${updateError}`);
    }
  }
}

module.exports = { translateWithOpenAI, handleLanguageSelection };
