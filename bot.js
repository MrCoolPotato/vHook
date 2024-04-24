require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  Collection,
  ActivityType,
} = require("discord.js");
const OpenAI = require("openai");

const deleteMemory = require("./commands/deleteMemory");
const deleteAllMemory = require("./commands/deleteAllMemory");
const setActivity = require("./commands/setActivity");

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
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

const commands = [
  {
    name: "deletememory",
    description: "Delete your conversation memory!",
    options: [],
  },
  {
    name: "deleteallmemory",
    description: "Delete all conversations from memory! (Dev only)",
    options: [],
  },
  {
    name: "setactivity",
    description: "Set the bot's activity! (Dev only)",
    options: [
      {
        type: 3,
        name: "activity",
        description: "The activity the bot should display",
        required: true,
      },
      {
        type: 3,
        name: "type",
        description: "The type of the activity (e.g., Playing, Competing)",
        required: true,
        choices: [
          { name: "Playing", value: "Playing" },
          { name: "Listening", value: "Listening" },
          { name: "Watching", value: "Watching" },
          { name: "Competing", value: "Competing" },
        ],
      },
    ],
  },
];

const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

client.on("ready", async () => {
  console.log("Bot is up and running!");
  console.log("CLIENT_ID:", process.env.CLIENT_ID);
  client.user.setPresence({
    status: "online",
    activities: [{ name: `for cores`, type: ActivityType.Competing }],
  });

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
const MAX_HISTORY = 200;

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  if (commandName === "deletememory") {
    deleteMemory(interaction, conversations);
  } else if (commandName === "deleteallmemory") {
    deleteAllMemory(interaction, conversations);
  } else if (commandName === "setactivity") {
    setActivity(interaction);
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user.id)) return;

  const userId = message.author.id;
  const username = message.author.username;
  let conversation = conversations.get(userId) || [];

  if (conversation.length === 0) {
    conversation.push({
      role: "system",
      content:
        "You are a helpful assistant powered by a LLM, you communicate through a BOT on discord which is maintained by developer named 'A' under the company NIS.",
    });
  }

  conversation.push({
    role: "user",
    content: message.content,
  });

  if (conversation.length > MAX_HISTORY) conversation.shift();

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: conversation,
    });

    conversation.push({
      role: "assistant",
      content: chatCompletion.choices[0].message.content,
    });

    if (conversation.length > MAX_HISTORY) conversation.shift();

    const responseContent = chatCompletion.choices[0].message.content;
    if (responseContent.length > 2000) {
      const chunkSize = 2000;
      for (let i = 0; i < responseContent.length; i += chunkSize) {
        const messageChunk = responseContent.substring(
          i,
          Math.min(responseContent.length, i + chunkSize)
        );
        await message.reply(messageChunk);
      }
    } else {
      await message.reply(responseContent);
    }

    conversations.set(userId, conversation);
  } catch (error) {
    console.error(`Error while fetching response from OpenAI: ${error}`);
    await message.reply(
      "Sorry, I encountered an error trying to process your request."
    );
  }
});

client.login(BOT_TOKEN).catch((error) => {
  console.error(`Error logging in: ${error}`);
});
