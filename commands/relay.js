require("dotenv").config();
const { ChannelType } = require("discord.js");

async function relay(interaction) {
  if (!interaction.deferred && !interaction.replied) {
    await interaction.deferReply({ ephemeral: true }).catch(console.error);
  }

  if (interaction.user.id !== process.env.DEVELOPER_ID) {
    return interaction.editReply({
      content: "You do not have permission to use this command.",
    });
  }

  const channel = interaction.options.getChannel("channel");

  if (!channel) {
    return interaction.editReply({
      content: "Channel not found.",
    });
  }

  if (channel.type !== ChannelType.GuildText) {
    return interaction.editReply({
      content: "Invalid channel type. Please select a text or news channel.",
    });
  }

  const text = interaction.options.getString("text");

  try {
    const message = await channel.send(text);
    if (message) {
      await interaction.editReply({
        content: "Message sent successfully!",
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
    let errorMsg = "Failed to send message.";
    if (error.message.includes("Missing Permissions")) {
      errorMsg += " Missing permissions to send messages in this channel.";
    }
    await interaction.followUp({
      content: errorMsg,
      ephemeral: true,
    });
  }
}

module.exports = relay;
