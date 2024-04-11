function deleteMemory(message, conversations) {
  // Get the user's ID
  const userId = message.author.id;

  // Delete the conversation history for this user
  conversations.delete(userId);

  // Reply to the user
  message.reply("Your conversation data has been deleted.");
}

module.exports = deleteMemory;
