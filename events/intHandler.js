const deleteMemory = require("../commands/deleteMemory");
const deleteAllMemory = require("../commands/deleteAllMemory");
const setActivity = require("../commands/setActivity");
const deleteMessages = require("../commands/deleteMessages");
const relay = require("../commands/relay");
const analyzeWithOpenAI = require("../commands/analyze");
const {
  translateWithOpenAI,
  handleLanguageSelection,
} = require("../commands/translate");

async function handleInteractionCreate(interaction, conversations) {
  console.log(`Received interaction: ${interaction.type}`);

  if (interaction.isCommand()) {
    const { commandName } = interaction;
    console.log(`Received command: ${commandName}`);

    try {
      if (commandName === "deletememory") {
        await deleteMemory(interaction, conversations);
      } else if (commandName === "deleteallmemory") {
        await deleteAllMemory(interaction, conversations);
      } else if (commandName === "setactivity") {
        await setActivity(interaction);
      } else if (commandName === "deletemessages") {
        await deleteMessages(interaction);
      } else if (commandName === "relay") {
        await relay(interaction);
      } else if (commandName === "analyze-with-openai") {
        await interaction.deferReply({ ephemeral: true });
        await analyzeWithOpenAI(interaction);
      } else if (commandName === "translate-with-openai") {
        await interaction.deferReply({ ephemeral: true });
        await translateWithOpenAI(interaction);
      } else {
        console.log(`Unhandled command: ${commandName}`);
      }
    } catch (error) {
      console.error(`Error handling command ${commandName}:`, error);
      await interaction.reply({
        content: "An error occurred while executing the command.",
        ephemeral: true,
      });
    }
  } else if (interaction.isStringSelectMenu()) {
    console.log(`Received string select menu: ${interaction.customId}`);
    await handleLanguageSelection(interaction);
  } else {
    console.log("Received an unrecognized interaction type.");
  }
}

module.exports = { handleInteractionCreate };
