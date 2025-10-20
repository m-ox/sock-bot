export async function curseTransform(message) {
  const bot = message.guild?.members?.me;
  if (!bot || !bot.permissions.has("ManageMessages")) {
    console.warn("Missing ManageMessages permission or guild context.");
    return null;
  }

  const content = message.content ?? "";
  if (!content.trim()) return null;
  
  const chars = content.split("");
  const limit = Math.floor(chars.length * 0.2);
  let replaced = 0;

  const cursedText = chars
    .map((ch) => {
      if (/[a-zA-Z]/.test(ch) && Math.random() < 0.25 && replaced < limit) {
        replaced++;
        return "👁️";
      }
      return ch;
    })
    .join("");

  try {
    await message.delete();
  } catch (err) {
    console.warn("Failed to delete message:", err.message);
  }

  const displayName = message.member?.displayName || message.author.username;
  return `**${displayName}** (cursed): ${cursedText}`;
}

async function ensureRole(guild, name, color, reason) {
  await guild.roles.fetch();
  let role = guild.roles.cache.find((r) => r.name === name);
  if (!role) {
    role = await guild.roles.create({ name, color, reason });
  }
  return role;
}

export async function executeCursed(message) {
  const target = message.mentions.members.first();
  if (!target) return message.reply("Tag someone to curse, mortal.");

  try {
    const cursedRole = await ensureRole(
      message.guild,
      "cursed",
      0x4b0082,
      "Needed for cursed command"
    );

    if (target.roles.cache.has(cursedRole.id)) {
      return message.reply(`${target.displayName} is already cursed.`);
    }

    await target.roles.add(cursedRole);
    await message.channel.send(
      `**${target.displayName.toUpperCase()} HAS BEEN CURSED... ☠️**`
    );
  } catch (err) {
    console.error("executeCursed error:", err);
    await message.reply("The curse failed to take hold.");
  }
}

export async function executePurify(message) {
  const target = message.mentions.members.first();
  if (!target) return message.reply("Tag someone to purify, mortal.");

  try {
    const cursedRole = message.guild.roles.cache.find(
      (r) => r.name === "cursed"
    );
    if (!cursedRole)
      return message.reply("No cursed role exists in this realm.");

    if (target.roles.cache.has(cursedRole.id)) {
      await target.roles.remove(cursedRole);
      await message.channel.send(
        `✨ ${target.displayName} has been purified. The curse is lifted.`
      );
    } else {
      await message.reply(`${target.displayName} is not cursed.`);
    }
  } catch (err) {
    console.error("executePurify error:", err);
    await message.reply("The purification ritual failed.");
  }
}
