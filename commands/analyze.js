const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function analyzeWithOpenAI(interaction) {
  const message = interaction.targetMessage;
  const reportPrompt = `
You are an assistant that analyzes user messages and provides a detailed report. Generate a strict, concise, and professional analysis of the following message:

Message: "${message.content}"

Provide the analysis in the following format:
1. **Content Analysis:** What is the message about? What could be the context?.
2. **Tone Analysis:** Determine the tone of the message (e.g., Neutral, Friendly, Aggressive, etc.).
3. **Summary:** Provide a brief summary of the message emphasizing the important details.
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful BOT that provides analysis reports.",
        },
        {
          role: "user",
          content: reportPrompt,
        },
      ],
    });

    const responseContent = chatCompletion.choices[0].message.content;

    await interaction.editReply({
      content: `**Analysis Report:**\n${responseContent}`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(`Error while fetching response from OpenAI: ${error}`);
    await interaction.followUp({
      content: "Sorry, I encountered an error trying to process your request.",
      ephemeral: true,
    });
  }
}

module.exports = analyzeWithOpenAI;
