const { ActivityType } = require("discord.js");
const OpenAI = require("openai");
require("dotenv").config();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Say a very short hello to the world in English!",
        },
      ],
    });
    console.log(`OpenAI test response: ${response.choices[0].message.content}`);
  } catch (error) {
    console.error(`Error testing OpenAI: ${error}`);
  }
}

async function initializeBot(client) {
  client.on("ready", async () => {
    console.log("Bot is up and running!");
    console.log("CLIENT_ID:", process.env.CLIENT_ID);
    client.user.setPresence({
      status: "online",
      activities: [{ name: `nucleus`, type: ActivityType.Competing }],
    });
    await testOpenAI();
  });
}

module.exports = { initializeBot };
