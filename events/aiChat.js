const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MAX_HISTORY = 200;

async function handleMessageCreate(message, client, conversations) {
  if (message.author.bot) return;
  if (!message.mentions.has(client.user.id)) return;

  const userId = message.author.id;
  let conversation = conversations.get(userId) || [];

  if (conversation.length === 0) {
    conversation.push({
      role: "system",
      content:
        "You are a helpful assistant powered by a LLM, you communicate through a BOT on discord which is maintained by developer named 'A' under the company NIS.",
    });
  }

  conversation.push({
    role: "user",
    content: message.content,
  });

  if (conversation.length > MAX_HISTORY) conversation.shift();

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: conversation,
    });

    conversation.push({
      role: "assistant",
      content: chatCompletion.choices[0].message.content,
    });

    if (conversation.length > MAX_HISTORY) conversation.shift();

    const responseContent = chatCompletion.choices[0].message.content;
    if (responseContent.length > 2000) {
      const chunkSize = 2000;
      for (let i = 0; i < responseContent.length; i += chunkSize) {
        const messageChunk = responseContent.substring(
          i,
          Math.min(responseContent.length, i + chunkSize)
        );
        await message.reply(messageChunk);
      }
    } else {
      await message.reply(responseContent);
    }

    conversations.set(userId, conversation);
  } catch (error) {
    console.error(`Error while fetching response from OpenAI: ${error}`);
    await message.reply(
      "Sorry, I encountered an error trying to process your request."
    );
  }
}

module.exports = { handleMessageCreate };
