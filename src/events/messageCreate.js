import { maintenanceCommands } from "../commands/maintenance.js";
import { executeZooted } from "../commands/zooted.js";
import { handleWorm } from "../commands/worm.js";
import { handleWarm } from "../commands/warm.js";
import { handlePocketSand } from "../commands/pocketsand.js";
import { applyEffect } from "../commands/index.js";
import { executeCursed, executePurify } from "../commands/cursed.js";

const prefixCommands = {
  "!online": maintenanceCommands.online,
  "!status": maintenanceCommands.status,
  "!updated": maintenanceCommands.updated,
  "!zooted": executeZooted,
  "!curse": executeCursed,
  "!purify": executePurify,
};

const passiveTriggers = {
  worm: handleWorm,
  warm: handleWarm,
  "pocket sand": handlePocketSand,
};

export default async function messageCreate(message, client) {
  if (message.author.bot || message.webhookId) return;

  const content = message.content.toLowerCase();
  const member = message.member;

  // --- PREFIX COMMANDS ---
  const [cmd] = content.split(" ");
  const commandFn = prefixCommands[cmd];
  if (commandFn) {
    return cmd === "!status"
      ? await commandFn(message, client)
      : await commandFn(message);
  }

  // --- PASSIVE TEXT TRIGGERS ---
  for (const [trigger, fn] of Object.entries(passiveTriggers)) {
    if (content.includes(trigger)) return await fn(message);
  }

  // --- ROLE EFFECTS ---
  const roles = member?.roles.cache.map((r) => r.name.toLowerCase()) || [];
  for (const role of roles) {
    try {
      const transformed = await applyEffect(role, message);
      if (transformed) await message.channel.send(transformed);
    } catch (err) {
      console.error(`Effect for role "${role}" failed:`, err);
    }
  }
}
