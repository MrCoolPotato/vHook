require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const OpenAI = require("openai");

const deleteMemory = require("./commands/deleteMemory");
const deleteAllMemory = require("./commands/deleteAllMemory");

// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BOT_TOKEN = process.env.BOT_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const commands = [
  {
    name: "deletememory",
    description: "Delete your conversation memory!",
  },
  {
    name: "deleteallmemory",
    description: "Delete all conversations from memory! (Admin only)",
  },
];

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

client.on("ready", async () => {
  console.log("Bot is up and running!");
  console.log("CLIENT_ID:", process.env.CLIENT_ID); // Ensures CLIENT_ID is loaded and logs it
  try {
    console.log("Started refreshing global application (/) commands.");
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });
    console.log("Successfully reloaded global application (/) commands.");
  } catch (error) {
    console.error("Failed to reload global application (/) commands:", error);
  }
  await testOpenAI();
});

const conversations = new Map();
const MAX_HISTORY = 100; // Maximum number of messages in each conversation history

async function testOpenAI() {
  try {
    const chatCompletion = await openai.ChatCompletion.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Say hello to the world in English!",
        },
      ],
    });

    console.log(`OpenAI test response: ${chatCompletion.choices[0].message}`);
  } catch (error) {
    console.error(`Error testing OpenAI: ${error}`);
  }
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "deletememory") {
    deleteMemory(interaction, conversations);
  } else if (commandName === "deleteallmemory") {
    deleteAllMemory(interaction, conversations);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user.id)) return;

  const userId = message.author.id;
  const username = message.author.username;
  let conversation = conversations.get(userId) || [];

  // Pushing new message to the conversation
  conversation.push({
    role: "user",
    content: `${username}: ${message.content}`,
  });

  if (conversation.length > MAX_HISTORY) conversation.shift();

  try {
    const chatCompletion = await openai.ChatCompletion.create({
      model: "gpt-4-turbo",
      messages: conversation,
    });

    // Adding bot's response to the conversation history
    conversation.push({
      role: "assistant",
      content: chatCompletion.choices[0].message,
    });

    if (conversation.length > MAX_HISTORY) conversation.shift();

    message.reply(chatCompletion.choices[0].message);
    conversations.set(userId, conversation);
  } catch (error) {
    console.error(`Error while fetching response from OpenAI: ${error}`);
    message.reply(
      "Sorry, I encountered an error trying to process your request."
    );
  }
});

client.login(BOT_TOKEN).catch((error) => {
  console.error(`Error logging in: ${error}`);
});
