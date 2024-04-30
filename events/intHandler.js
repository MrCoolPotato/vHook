const deleteMemory = require("../commands/deleteMemory");
const deleteAllMemory = require("../commands/deleteAllMemory");
const setActivity = require("../commands/setActivity");
const deleteMessages = require("../commands/deleteMessages");

async function handleInteractionCreate(interaction, conversations) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;
  try {
    if (commandName === "deletememory") {
      await deleteMemory(interaction, conversations);
    } else if (commandName === "deleteallmemory") {
      await deleteAllMemory(interaction, conversations);
    } else if (commandName === "setactivity") {
      await setActivity(interaction);
    } else if (commandName === "deletemessages") {
      await deleteMessages(interaction);
    }
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    await interaction.reply({
      content: "An error occurred while executing the command.",
      ephemeral: true,
    });
  }
}

module.exports = { handleInteractionCreate };
