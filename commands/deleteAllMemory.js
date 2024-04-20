require("dotenv").config();

const developerId = process.env.DEVELOPER_ID;

async function deleteAllMemory(interaction, conversations) {
  try {
    if (interaction.user.id !== developerId) {
      await interaction.reply("Developer only command.");
      return;
    }

    if (!conversations || !(conversations instanceof Map)) {
      throw new Error("Invalid conversations storage.");
    }

    conversations.clear();
    await interaction.reply("All conversation histories have been cleared.");
  } catch (error) {
    console.error(`Error deleting all memory: ${error}`);
    await interaction.reply(
      "Failed to clear conversation histories due to an error."
    );
  }
}

module.exports = deleteAllMemory;
