const MAX_MESSAGE_LENGTH = 2000;

function chunkMessage(message, size = MAX_MESSAGE_LENGTH) {
  const chunks = [];
  for (let i = 0; i < message.length; i += size) {
    chunks.push(message.substring(i, Math.min(message.length, i + size)));
  }
  return chunks;
}

module.exports = { chunkMessage };
