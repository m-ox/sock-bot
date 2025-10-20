import { executeZooted } from "../commands/zooted.js";
import { handleWorm } from "../commands/worm.js";
import { handleWarm } from "../commands/warm.js";
import { applyEffect } from "../effects/index.js";
import { executeCursed } from "../effects/cursed.js";
import { executePurify } from "../effects/purify.js";
import { handlePocketSand } from "../commands/pocketsand.js";

export default async function messageCreate(message) {
  // ignore bots and webhooks
  if (message.author.bot || message.webhookId) return;

  const content = message.content.toLowerCase();
  const member = message.member;

  // --- COMMAND HANDLERS ---
  if (content.startsWith("!zooted")) return await executeZooted(message);
  if (content.includes("worm")) return await handleWorm(message);
  if (content.includes("warm")) return await handleWarm(message);
  if (content.includes("pocket sand")) return await handlePocketSand(message);
  if (content.startsWith("!curse")) return await executeCursed(message);
  if (content.startsWith("!purify")) return await executePurify(message);

  // --- CURSE TEXT EFFECT ---
  const isCursed = member?.roles.cache.some(
    (r) => r.name.toLowerCase() === "cursed"
  );
  const isCommand = content.startsWith("!");
  const isCursedEcho = content.includes("(cursed):");

  // only distort normal, non-command messages
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
