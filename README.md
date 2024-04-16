# vHook

```markdown
# Discord OpenAI Bot

## Overview

This Discord bot integrates with OpenAI's GPT-3.5 to provide interactive conversations and also includes the ability to manage conversation histories with specific commands for memory deletion. It uses Discord.js v14 and the OpenAI node module for seamless integration and interaction on Discord servers.

## Features

- Interact with users using AI-generated text based on previous messages in a conversation.
- Admin-specific commands to delete user conversations.
- Docker support for easy deployment and scaling.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.x or later)
- npm (or Yarn)
- Docker (if deploying using Docker)
- A Discord Bot Token (from the Discord Developer Portal)
- An OpenAI API Key

## Setup

1. **Clone the repository:**
```

git clone https://github.com/MrCoolPotato/Discord-multi-purpose-chatbot.git

```

2. **Configure your environment variables:**

Create a `.env` file in the root directory and populate it with your credentials:

```

BOT_TOKEN=your_discord_bot_token_here
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_ID=your_discord_client_id_here

```

3. **Install dependencies:**

```

npm install

```

## Running the Bot

### Locally

To run the bot locally, use the following command:

```

node bot.js

```

## Command List

- `/deletememory` - Deletes the conversation history of the user who issued the command.
- `/deleteallmemory` - Deletes all conversation histories (admin only).

## Development

Feel free to fork the project and submit pull requests. You can enhance the bot by adding more interactive features or improving the existing commands.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
```
