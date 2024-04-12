const Discord = require("discord.js");
const { OpenAI, Configuration } = require("openai");
const deleteMemory = require("./commands/deleteMemory");
const deleteAllMemory = require("./commands/deleteAllMemory");
const { Client, GatewayIntentBits } = require("discord.js");

const configuration = new OpenAI.Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAI(configuration);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const BOT_TOKEN = process.env.BOT_TOKEN;

client.on("ready", async () => {
  console.log(`UP!`);
  await testOpenAI();
});

const conversations = new Map();

const MAX_HISTORY = 100; // Maximum number of messages in each conversation history

async function testOpenAI() {
  try {
    const response = await openai.Completion.create({
      model: "text-davinci-002",
      prompt: "Say hello to the world!",
      max_tokens: 100,
    });

    console.log(`OpenAI test response: ${response.choices[0].text.trim()}`);
  } catch (error) {
    console.error(`Error testing OpenAI: ${error}`);
  }
}

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === "deletememory") {
      deleteMemory(interaction, conversations);
    } else if (commandName === "deleteallmemory") {
      deleteAllMemory(interaction, conversations);
    }
  } catch (error) {
    console.error(`Error handling interaction: ${error}`);
  }
});

client.on("messageCreate", async (message) => {
  try {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Only process the message if the bot is mentioned
    if (!message.mentions.has(client.user.id)) return;

    // Get the user's ID and name
    const userId = message.author.id;
    const username = message.author.username;

    // Get the conversation history for this user
    let conversation = conversations.get(userId);
    if (!conversation) {
      conversation = [];
      conversations.set(userId, conversation);
    }

    // Add the user's message to the conversation history
    conversation.push(`${username}: ${message.content}`);

    // If the conversation history is too long, remove the oldest message
    if (conversation.length > MAX_HISTORY) {
      conversation.shift();
    }

    // Send the conversation history to the OpenAI API
    const response = await openai.Completion.create({
      model: "text-davinci-002",
      prompt: conversation.join("\n"),
      max_tokens: 100,
    });

    // Add the model's response to the conversation history
    conversation.push(`Bot: ${response.choices[0].text.trim()}`);

    // If the conversation history is too long, remove the oldest message
    if (conversation.length > MAX_HISTORY) {
      conversation.shift();
    }

    // Reply with the model's response
    message.reply(response.choices[0].text.trim());
  } catch (error) {
    console.error(`Error handling message: ${error}`);
  }
});

try {
  client.login(BOT_TOKEN);
} catch (error) {
  console.error(`Error logging in: ${error}`);
}
