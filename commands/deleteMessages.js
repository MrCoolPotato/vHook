const { PermissionFlagsBits } = require("discord.js");

async function deleteMessages(interaction) {
  if (!interaction.guild) {
    return interaction.reply({
      content: "This command can only be used within a server.",
      ephemeral: true,
    });
  }

  if (!interaction.channel) {
    return interaction.reply({
      content: "Unable to access this channel.",
      ephemeral: true,
    });
  }

  const memberPermissions = interaction.channel.permissionsFor(
    interaction.member
  );

  if (
    !memberPermissions ||
    !memberPermissions.has(PermissionFlagsBits.ManageMessages)
  ) {
    return interaction.reply({
      content: "You do not have permission to manage messages in this channel.",
      ephemeral: true,
    });
  }

  const count = interaction.options.getInteger("count");
  try {
    const fetchedMessages = await interaction.channel.messages.fetch({
      limit: count,
    });
    const deletable = fetchedMessages.filter((m) => !m.pinned);
    await interaction.channel.bulkDelete(deletable, true);

    return interaction.reply({
      content: `Successfully deleted ${deletable.size} messages.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error("Error deleting messages:", error.stack || error);
    let errorMessage = "Failed to delete messages.";
    if (error.message.includes("Unknown Message")) {
      errorMessage += " Some messages may not exist or are older than 14 days.";
    } else if (error.message.includes("Missing Permissions")) {
      errorMessage += " Missing permissions to delete some or all messages.";
    }
    return interaction.reply({
      content: errorMessage,
      ephemeral: true,
    });
  }
}

module.exports = deleteMessages;
