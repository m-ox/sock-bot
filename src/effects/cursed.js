export async function executeCursed(message) {
  const target = message.mentions.members.first();
  if (!target) {
    await message.reply("Tag someone to curse, mortal.");
    return;
  }

  await message.guild.roles.fetch();
  let cursedRole = message.guild.roles.cache.find(r => r.name === "cursed");
  if (!cursedRole) {
    cursedRole = await message.guild.roles.create({
      name: "cursed",
      color: 0x4b0082,
      reason: "Needed for cursed command",
    });
  }

  // stop if target already cursed
  if (target.roles.cache.has(cursedRole.id)) {
    await message.reply(`${target.displayName} is already cursed.`);
    return;
  }

  // fetch target's last message (optional)
  const messages = await message.channel.messages.fetch({ limit: 50 });
  const targetMessage = messages.find(
    (m) => m.author.id === target.id && m.id !== message.id
  );

  const cursedMap = { /* same map as before */ };
  const corrupt = (text) =>
    text
      .split("")
      .map((ch) => (Math.random() < 0.1 ? "👁️" : cursedMap[ch.toLowerCase()] || ch))
      .join("");

  try {
    await target.roles.add(cursedRole);

    if (
      targetMessage &&
      message.guild.members.me.permissions.has("ManageMessages")
    ) {
      await targetMessage.delete();
      const cursedText = corrupt(targetMessage.content);
      await message.channel.send(`**${target.displayName}** (cursed): ${cursedText}`);
    }

    await message.channel.send(
      `**${target.displayName.toUpperCase()} HAS BEEN CURSED... ☠️**`
    );
  } catch (err) {
    console.error("Curse failed:", err);
    await message.reply("The curse fizzled out.");
  }
}
