function deleteAllMemory(message, conversations) {
  // Check if the user's ID matches the specified ID
  if (message.author.id !== "167700985425166336") {
    message.reply("Developer only command.");
    return;
  }

  // Delete all conversation histories
  conversations.clear();

  // Reply to the user
  message.reply("Context manager restarted.");
}

module.exports = deleteAllMemory;
