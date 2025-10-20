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
