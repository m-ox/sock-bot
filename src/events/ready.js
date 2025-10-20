import { executeZooted } from "../commands/zooted.js";
import { handleWorm } from "../commands/worm.js";
import { handleWarm } from "../commands/warm.js";
import { handlePocketSand } from "../commands/pocketsand.js";
import { applyEffect } from "../effects/index.js";
import { executeCursed, executePurify } from "../effects/cursed.js";
import { maintenanceCommands } from "../commands/maintenance.js";

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

  // --- CURSE TEXT EFFECT ---
  const isCursed = member?.roles.cache.some((r) => r.name.toLowerCase() === "cursed");
  const isCommand = content.startsWith("!");
  const isCursedEcho = content.includes("(cursed):");
  if (isCursed && !isCommand && !isCursedEcho) {
    const botMember = message.guild.members.me;
    if (botMember?.permissions.has("ManageMessages")) {
      try {
        const cursedText = message.content
          .split("")
          .map((ch) =>
            /[a-zA-Z]/.test(ch) && Math.random() < 0.25 ? "👁️" : ch
          )
          .join("");

        await message.delete();
        await message.channel.send(
          `**${member.displayName}** (cursed): ${cursedText}`
        );
      } catch (err) {
        console.error("Failed to apply curse effect:", err);
      }
    }
  }

  // --- ROLE EFFECTS ---
  const roles = member?.roles.cache.map((r) => r.name.toLowerCase()) || [];
  for (const role of roles) {
    const transformed = applyEffect(role, message);
    if (transformed) {
      try {
        await message.channel.send(transformed);
      } catch (err) {
        console.error(`Effect send failed for ${role}:`, err);
      }
    }
  }
}
