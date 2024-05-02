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
    description: "Send a message to a specified channel.",
    options: [
      {
        name: "text",
        type: 3,
        description: "The message to send",
        required: true,
      },
      {
        name: "channel",
        type: 7,
        description: "Select the channel to send the message to",
        required: true,
        channelTypes: ["GUILD_TEXT"],
      },
    ],
  },
];

module.exports = commands;
