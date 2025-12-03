// index.js
import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./src/events/registerEvents.js";
import "./src/utils/telnet.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

registerEvents(client);
client.login(process.env.DISCORD_TOKEN);
