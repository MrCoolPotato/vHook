require("dotenv").config();

const { ActivityType } = require("discord.js");

function setActivity(interaction) {
  try {
    if (interaction.user.id !== process.env.DEVELOPER_ID) {
      return interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const activity = interaction.options.getString("activity");
    const type = interaction.options.getString("type");

    interaction.client.user.setPresence({
      activities: [{ name: activity, type: ActivityType[type] }],
      status: "online",
    });

    interaction.reply({
      content: `Activity set to ${type}: '${activity}'`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(`Error setting activity: ${error}`);
    interaction.reply({
      content:
        "There was an error processing your request to set the activity.",
      ephemeral: true,
    });
  }
}

module.exports = setActivity;
