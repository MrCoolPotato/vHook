# Use an official Node.js runtime as the base image
FROM node:14
# Set the working directory in the Docker container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install the bot's dependencies
RUN npm install
# Copy the rest of the bot's code to the working directory
COPY . .
# Expose port 3000 for the bot (change this if your bot uses a different port)
EXPOSE 3000
# Start the bot
CMD [ "node", "bot.js" ]