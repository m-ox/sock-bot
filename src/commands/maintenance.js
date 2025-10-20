import { EmbedBuilder } from "discord.js";
import fs from "fs";
import path from "path";

// fuck it we stealing
/**
 * Maintenance utility commands for Sock Bot
 * - !online   — checks if the bot is responsive
 * - !status   — reports uptime and latency
 * - !updated  — reports last git update time
 */
export const maintenanceCommands = {
  async online(message) {
    await message.reply("✅ SockBot is online and responsive.");
  },

  async status(message, client) {
    const uptime = formatUptime(process.uptime());
    const latency = Date.now() - message.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor("#00FF88")
      .setTitle("🧦 SockBot Status")
      .addFields(
        { name: "Uptime", value: uptime, inline: true },
        { name: "Latency", value: `${latency}ms`, inline: true }
      )
      .setFooter({ text: "System operational." });

    await message.reply({ embeds: [embed] });
  },

  async updated(message) {
    try {
      const gitPath = path.resolve(process.cwd(), ".git", "FETCH_HEAD");
      const lastUpdated = fs.statSync(gitPath).mtime;
      const formatted = new Date(lastUpdated).toLocaleString();
      await message.reply(`📦 Last updated from main: **${formatted}**`);
    } catch {
      await message.reply("⚠️ Could not determine last update time.");
    }
  },
};

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}
