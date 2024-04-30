const { REST, Routes, ActivityType } = require("discord.js");
const OpenAI = require("openai");
require("dotenv").config();

const commands = require("../commands/registry");

const BOT_TOKEN = process.env.BOT_TOKEN;
const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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

    try {
      console.log("Started refreshing global application (/) commands.");
      const headers = {
        Authorization: `Bearer ${process.env.BOT_TOKEN}`,
        "Content-Type": "application/json",
      };
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        headers: headers,
        body: commands,
      });
      console.log("Successfully reloaded global application (/) commands.");
    } catch (error) {
      console.error("Failed to reload global application (/) commands:", error);
    }
    await testOpenAI();
  });
}

module.exports = { initializeBot };
