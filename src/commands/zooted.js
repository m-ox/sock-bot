export async function executeZooted(message) {
  const target = message.mentions.members.first();
  if (!target) {
    await message.reply("Tag someone to zoot, maaan.");
    return;
  }

  // find or create the 'zooted' role
  let zootedRole = message.guild.roles.cache.find(r => r.name === 'zooted');
  if (!zootedRole) {
    try {
      zootedRole = await message.guild.roles.create({
        name: 'zooted',
        color: 0x00ff9d,
        reason: 'Needed for zooted command',
      });
    } catch (err) {
      console.error('Role creation failed:', err);
      await message.reply('Could not create the zooted role.');
      return;
    }
  }

  // assign the role and announce
  try {
    await target.roles.add(zootedRole);
    await message.channel.send({
      content: `**${target.displayName.toUpperCase()} IS NOW ABSOLUTELY ZOOTED, MAAAN!** 🌿💨`,
    });
  } catch (err) {
    console.error('Role assign failed:', err);
    await message.reply('Could not assign the role.');
  }
}
