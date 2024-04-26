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
  const botPermissions = interaction.channel.permissionsFor(
    interaction.guild.me
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

  if (
    !botPermissions ||
    !botPermissions.has(PermissionFlagsBits.ManageMessages)
  ) {
    return interaction.reply({
      content: "I do not have permission to manage messages in this channel.",
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
    console.error("Error deleting messages:", error);
    return interaction.reply({
      content:
        "Failed to delete messages. Please make sure I have the correct permissions and that the messages are not older than 14 days.",
      ephemeral: true,
    });
  }
}

module.exports = deleteMessages;
