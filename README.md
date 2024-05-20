# Discord OpenAI Bot

![Pfp](Pfp.png)

## Overview

This Discord bot integrates with OpenAI's GPT-4o(or any model) to provide interactive conversations and also includes the ability to manage conversation histories with specific commands for memory deletion. It uses Discord.js v14 and the OpenAI node module for seamless integration and interaction on Discord servers.

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

Create a `.env` file(check example) in the root directory and populate it with your credentials:

```

BOT_TOKEN=your_discord_bot_token_here
OPENAI_API_KEY=your_openai_api_key_here
CLIENT_ID=your_discord_client_id_here
DEVELOPER_ID=your_discord_id_here (this account will have elevated access to the bot)

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

### 1. Delete Memory

- **Command:** `/deletememory`
- **Description:** Clears your personal conversation history with the bot.

### 2. Delete All Memory

- **Command:** `/deleteallmemory`
- **Description:** Removes all users' conversations from the bot's memory, restricted to developers.

### 3. Set Activity

- **Command:** `/setactivity`
- **Description:** Updates the bot's displayed activity to a specified type (e.g., Playing, Listening). This command is restricted to developers.

### 4. Delete Messages

- **Command:** `/deletemessages`
- **Description:** Deletes a specified number of recent messages in the channel, up to 100.

### 5. Relay Message

- **Command:** `/relay`
- **Description:** Sends a message to a specified channel. This command is restricted to the developer only, ensuring that only authorized users can relay messages through the bot.
- **Parameters:**
  - `text`: The message text to send.
  - `channel`: The Discord channel to which the message will be sent. Only text and news channels are allowed.

Ensure that the bot has appropriate permissions in the channel to send messages.

### 6. Analyze with OpenAI

- **Command:** `Analyze with OpenAI` (Message Context Menu)
- **Description:** Analyzes the selected message using OpenAI's GPT-4 model and replies with the generated response.

### 7. Translate with OpenAI

- **Command:** `Translate with OpenAI` (Message Context Menu)
- **Description:** Translates the selected message using OpenAI's GPT-4 model and replies with the translated text.
- **Target Language Selection:** The bot will prompt the user to select a target language after right-clicking on the message to translate.
