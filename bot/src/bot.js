const Discord = require("discord.js");
const openai = require("openai");
const deleteMemory = require("./commands/deleteMemory");
const deleteAllMemory = require("./commands/deleteAllMemory");

openai.apiKey = process.env.OPENAI_API_KEY;

const client = new Discord.Client();
const BOT_TOKEN = process.env.BOT_TOKEN;

client.on("ready", () => {
  console.log(`UP!`);
});

const conversations = new Map();

const MAX_HISTORY = 100; // Maximum number of messages in each conversation history

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
  // Ignore messages from bots
  if (message.author.bot) return;

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
    engine: "text-davinci-002",
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
});
client.login(BOT_TOKEN);
