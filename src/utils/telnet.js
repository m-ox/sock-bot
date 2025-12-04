import "dotenv/config";
import net from "net";
import { client } from "../../index.js";

const HOST = process.env.SEVENDTD_HOST;
const PORT = Number(process.env.SEVENDTD_PORT);
const PASS = process.env.SEVENDTD_TELNET_PASS;
const CHANNEL = process.env.SEVENDTD_CHANNEL;

let sock = null;
let buffer = "";

// -------------------------------------------------------------
// FILTERS
// -------------------------------------------------------------
const DROP = [
  "XML patch",                    // mod patch failures
  "did not apply",                // mod errors
  "WRN XML",                      // mod warnings
  "WRN"                           // engine patch warnings
];

const ALLOW = [
  "joined the game",
  "Player connected",
  "disconnected",
  "INF Chat",
  "GMSG",
  "Party",
  "Zombie"
];

// -------------------------------------------------------------
// FORMATTER
// -------------------------------------------------------------
function formatLog(line) {
  const m = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(.*)$/);
  if (!m) return line;
  const [, date, time, level, msg] = m;
  return `[${date} ${time}] ${level}: ${msg}`;
}

// -------------------------------------------------------------
// FILTER
// -------------------------------------------------------------
function shouldDrop(line) {
  for (const k of DROP) if (line.includes(k)) return true;
  return false;
}

function shouldAllow(line) {
  for (const k of ALLOW) if (line.includes(k)) return true;
  return false;
}

// -------------------------------------------------------------
// TELNET SETUP
// -------------------------------------------------------------
function startTelnet() {
  sock = net.connect({ host: HOST, port: PORT }, () => {
    sock.write(PASS + "\n");
  });

  sock.on("data", (chunk) => {
    buffer += chunk.toString();
    const parts = buffer.split("\n");
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

// -------------------------------------------------------------
// LINE HANDLER
// -------------------------------------------------------------
function processLine(line) {
  if (!line) return;
  if (shouldDrop(line)) return;
  if (!shouldAllow(line)) return;

  const channel = client.channels.cache.get(CHANNEL);
  if (!channel) return;

  channel.send(formatLog(line));
}

// -------------------------------------------------------------
startTelnet();
