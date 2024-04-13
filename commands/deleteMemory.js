function deleteMemory(message, conversations) {
  try {
    const userId = message.author.id;

    if (conversations.has(userId)) {
      conversations.delete(userId);
      message.reply("Your conversation data has been deleted.");
    } else {
      message.reply("No conversation data found to delete.");
    }
  } catch (error) {
    console.error(`Error deleting memory: ${error}`);
    message.reply(
      "There was an error processing your request to delete conversation data."
    );
  }
}

module.exports = deleteMemory;
