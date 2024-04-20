function deleteMemory(interaction, conversations) {
  try {
    const userId = interaction.user.id;

    if (conversations.has(userId)) {
      conversations.delete(userId);
      interaction.reply("Your conversation data has been deleted.");
    } else {
      interaction.reply("No conversation data found to delete.");
    }
  } catch (error) {
    console.error(`Error deleting memory: ${error}`);
    interaction.reply(
      "There was an error processing your request to delete conversation data."
    );
  }
}

module.exports = deleteMemory;
