import axios from 'axios';
import * as dotenv from 'dotenv';
import * as tmi from 'tmi.js';

// Load environment variables from .env file
dotenv.config();

// Check if the required environment variables are set
const requiredEnvVars = [
  'TWITCH_CLIENT_ID',
  'TWITCH_USERNAME',
  'TWITCH_TOKEN',
  'TWITCH_CHANNELS'
];
if (requiredEnvVars.some(varName => !process.env[varName])) {
  console.error('Please set the following environment variables:');
  console.error(requiredEnvVars.filter(varName => !process.env[varName]).join(', '));
  process.exit(1);
}

const user = process.env.TWITCH_USERNAME!;
const token = process.env.TWITCH_TOKEN!;
const channels = process.env.TWITCH_CHANNELS!.split(',').map(channel => channel.trim());
const colors = process.env.COLORS?.split(',').map(color => color.trim()) || [
  "#FF0000",
  "#0000FF",
  "#00FF00",
  "#B22222",
  "#FF7F50",
  "#9ACD32",
  "#FF4500",
  "#2E8B57",
  "#DAA520",
  "#D2691E",
  "#5F9EA0",
  "#1E90FF",
  "#FF69B4",
  "#8A2BE2",
  "#00FF7F"
];

// Function to change the color of the user's name in Twitch chat using the Twitch API
const changeColor = async (user_id: number, color: string) => {
  try {
    const response = await axios.put(`https://api.twitch.tv/helix/chat/color`, {
      user_id: user_id,
      color: color
    }, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID!,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      console.log(`Color changed to ${color}`);
    } else {
      console.error(`Failed to change color: ${response.statusText}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error changing color: ${error.response?.status} - ${error.response?.data}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
  }
}

(async () => {
  console.log('Starting Twitch Name Color Changer...');

  const opts: tmi.Options = {
    identity: {
      username: user,
      password: `oauth:${token}`
    },
    channels: channels
  };

  // Create a client with our options
  const client = new tmi.client(opts);

  // Connect to Twitch:
  client.connect();

  // connect event handler
  client.on('connected', (addr, port) => {
    console.log(`Connected to ${addr}:${port}`);
    console.log(`Joined channels: ${channels.join(', ')}`);
  });

  // initial color index
  let currentColorIndex = 0;

  // listen for messages in the chat
  client.on('message', async (channel, tags, message, self) => {
    if (self) return; // Ignore messages from the bot itself

    // Check if user is the one we want to change color for
    if (tags.username === user) {
      // Randomly select a new color from the list
      let newColorIndex = Math.floor(Math.random()*colors.length);
      // Ensure the new color is different from the current one
      while (newColorIndex === currentColorIndex) {
        newColorIndex = Math.floor(Math.random() * colors.length);
      }
      currentColorIndex = newColorIndex;
      const newColor = colors[currentColorIndex];

      if (newColor && tags['user-id']) {
        console.log(`Changing color for user ${user} in channel ${channel} to ${newColor}`);

        // Change the color using the Twitch API
        await changeColor(parseInt(tags['user-id']), colors[currentColorIndex]);
      }
    }
  });
})();