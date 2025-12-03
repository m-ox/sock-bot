// src/utils/telnet.js
import "dotenv/config";
import net from "net";
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "../events/registerEvents.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
});

registerEvents(client);
client.login(process.env.DISCORD_TOKEN);

// ------------------------------------------------------------------
// TELNET STREAM TO 7DTD SERVER
// ------------------------------------------------------------------

const HOST = process.env.SEVENDTD_HOST;
const PORT = Number(process.env.SEVENDTD_PORT);
const PASS = process.env.SEVENDTD_TELNET_PASS;
const CHANNEL = process.env.SEVENDTD_CHANNEL;

let sock = null;
let buffer = "";

function startTelnet() {
  sock = net.connect({ host: HOST, port: PORT }, () => {
    sock.write(PASS + "\n");
  });

  sock.on("data", (chunk) => {
    buffer += chunk.toString();

    let parts = buffer.split("\n");
    buffer = parts.pop();

    for (const line of parts) processLine(line.trim());
  });

  sock.on("error", () => {
    setTimeout(startTelnet, 2000);
  });

  sock.on("close", () => {
    setTimeout(startTelnet, 2000);
  });
}

function processLine(line) {
  if (!line) return;

  if (
    line.includes("joined the game") ||
    line.includes("Player connected") ||
    line.includes("disconnected") ||
    line.includes("INF Chat") ||
    line.includes("GMSG") ||
    line.includes("Party") ||
    line.includes("Zombie")
  ) {
    const channel = client.channels.cache.get(CHANNEL);
    if (channel) channel.send(line);
  }
}

startTelnet();
