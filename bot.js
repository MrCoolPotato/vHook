require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const { initializeBot } = require("./events/ready");
const { handleInteractionCreate } = require("./events/intHandler");
const { handleMessageCreate } = require("./events/aiChat");

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

initializeBot(client);

const conversations = new Map();

client.on("interactionCreate", async (interaction) => {
  handleInteractionCreate(interaction, conversations);
});

client.on("messageCreate", async (message) => {
  handleMessageCreate(message, client, conversations);
});

client.login(process.env.BOT_TOKEN).catch((error) => {
  console.error(`Error logging in: ${error}`);
});
