const {
  Routes,
  REST,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
} = require("discord.js");
require("dotenv").config();

const slashCommands = [
  {
    name: "deletememory",
    description: "Clear your personal conversation history with the bot.",
    options: [],
  },
  {
    name: "deleteallmemory",
    description:
      "Remove all users' conversations from the bot's memory (developer-only).",
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
  {
    name: "deletemessages",
    description: "Delete a specified number of messages in the channel.",
    options: [
      {
        type: 4,
        name: "count",
        description: "The number of messages to delete",
        required: true,
        minValue: 1,
        maxValue: 100,
      },
    ],
  },
  {
    name: "relay",
    description: "Send a message to a specified channel (developer-only).",
    options: [
      {
        name: "text",
        type: 3,
        description: "The message text to send",
        required: true,
      },
      {
        name: "channel",
        type: 7,
        description: "The channel to send the message to",
        required: true,
        channel_types: [0, 5],
      },
    ],
  },
];

const contextMenuCommands = [
  new ContextMenuCommandBuilder()
    .setName("analyze-with-openai")
    .setType(ApplicationCommandType.Message)
    .toJSON(),
  new ContextMenuCommandBuilder()
    .setName("translate-with-openai")
    .setType(ApplicationCommandType.Message)
    .toJSON(),
];

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
  try {
    console.log("Started refreshing global application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [...slashCommands, ...contextMenuCommands],
    });

    console.log("Successfully reloaded global application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
