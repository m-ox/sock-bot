import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./src/events/registerEvents.js";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

// register events
registerEvents(client);

// login FIRST so client exists
client.login(process.env.DISCORD_TOKEN);

// import telnet AFTER client is exported + logged in
import "./src/utils/telnet.js";
