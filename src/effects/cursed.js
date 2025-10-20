export async function curseTransform(message) {
  const bot = message.guild.members.me;
  if (!bot?.permissions.has("ManageMessages")) return null;

  const cursedText = message.content
    .split("")
    .map((ch) => (/[a-zA-Z]/.test(ch) && Math.random() < 0.25 ? "👁️" : ch))
    .join("");

  try {
    await message.delete();
  } catch (_) {}

  return `**${message.member.displayName}** (cursed): ${cursedText}`;
}

export async function executeCursed(message) {
  const target = message.mentions.members.first();
  if (!target) return message.reply("Tag someone to curse, mortal.");

  await message.guild.roles.fetch();
  let cursedRole = message.guild.roles.cache.find((r) => r.name === "cursed");
  if (!cursedRole) {
    cursedRole = await message.guild.roles.create({
      name: "cursed",
      color: 0x4b0082,
      reason: "Needed for cursed command",
    });
  }

  if (target.roles.cache.has(cursedRole.id))
    return message.reply(`${target.displayName} is already cursed.`);

  await target.roles.add(cursedRole);
  await message.channel.send(`**${target.displayName.toUpperCase()} HAS BEEN CURSED... ☠️**`);
}

export async function executePurify(message) {
  const target = message.mentions.members.first();
  if (!target) {
    await message.reply("Tag someone to purify, mortal.");
    return;
  }

  await message.guild.roles.fetch();
  const cursedRole = message.guild.roles.cache.find(r => r.name === "cursed");
  if (!cursedRole) {
    await message.reply("No cursed role exists in this realm.");
    return;
  }

  try {
    if (target.roles.cache.has(cursedRole.id)) {
      await target.roles.remove(cursedRole);
      await message.channel.send(
        `✨ ${target.displayName} has been purified. The curse is lifted.`
      );
    } else {
      await message.reply(`${target.displayName} is not cursed.`);
    }
  } catch (err) {
    console.error("Failed to purify:", err);
    await message.reply("The purification ritual failed.");
  }
}
