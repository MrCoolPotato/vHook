function deleteMemory(message, conversations) {
  try {
    // Get the user's ID
    const userId = message.author.id;

    // Delete the conversation history for this user
    conversations.delete(userId);

    // Reply to the user
    message.reply("Your conversation data has been deleted.");
  } catch (error) {
    console.error(`Error deleting memory: ${error}`);
  }
}

module.exports = deleteMemory;
