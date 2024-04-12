function deleteAllMemory(message, conversations) {
  try {
    // Check if the user's ID matches the specified ID
    if (message.author.id !== "167700985425166336") {
      message.reply("Developer only command.");
      return;
    }

    // Delete all conversation histories
    conversations.clear();

    // Reply to the user
    message.reply("Context manager restarted.");
  } catch (error) {
    console.error(`Error deleting all memory: ${error}`);
  }
}

module.exports = deleteAllMemory;
