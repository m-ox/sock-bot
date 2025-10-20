export async function executeZooted(message) {
  const bot = message.guild.members.me;
  if (!bot?.permissions.has("ManageMessages"))
    return message.reply("I need ManageMessages permission to do that, maaan.");

  // Fetch or create the zooted role
  let zootedRole = message.guild.roles.cache.find((r) => r.name === "zooted");
  if (!zootedRole) {
    try {
      zootedRole = await message.guild.roles.create({
        name: "zooted",
        color: 0x00ff9d,
        reason: "Needed for zooted command",
      });
    } catch (err) {
      console.error("Role creation failed:", err);
      return message.reply("Could not create the zooted role.");
    }
  }

  // If user already has zooted role, they’re just posting while zooted — apply text effect
  if (message.member.roles.cache.has(zootedRole.id)) {
    const inserts = ["dude", "bro", "maaan", "like", "yo"];
    const exclaims = ["whoa", "far out", "totally", "no way", "for real"];
    const words = message.content.split(/\s+/).slice(1); // skip command prefix if any

    const mapped = words.map((w) => {
      if (Math.random() < 0.15)
        return w + "..." + inserts[Math.floor(Math.random() * inserts.length)];
      if (Math.random() < 0.1)
        return w.replace(/[aeiou]/gi, (v) => v + v);
      return w;
    });

    const zootedText =
      mapped.join(" ") +
      `, ${exclaims[Math.floor(Math.random() * exclaims.length)]} maaan 🌿`;

    try {
      await message.delete().catch(() => {});
    } catch {}

    const canWebhooks = bot.permissions.has("ManageWebhooks");
    if (canWebhooks) {
      try {
        const hook = await message.channel.createWebhook({
          name: message.member.displayName,
          avatar: message.author.displayAvatarURL({ format: "png" }),
        });

        await hook.send({
          content: zootedText,
          username: message.member.displayName,
          avatarURL: message.author.displayAvatarURL({ format: "png" }),
        });

        await new Promise((r) => setTimeout(r, 250));
        await hook.delete().catch(() => {});
      } catch (err) {
        console.error("Webhook failed:", err);
        await message.channel.send(
          `**${message.member.displayName}** (zooted): ${zootedText}`
        );
      }
    } else {
      await message.channel.send(
        `**${message.member.displayName}** (zooted): ${zootedText}`
      );
    }

    return;
  }

  // Otherwise: command invocation to zoot someone
  const target = message.mentions.members.first();
  if (!target)
    return message.reply("Tag someone to zoot, maaan."); // only appears when command is used incorrectly

  try {
    await target.roles.add(zootedRole);
  } catch (err) {
    console.error("Role assign failed:", err);
    return message.reply("Could not assign the role.");
  }

  // Try to find their last normal message to zootify
  const fetched = await message.channel.messages.fetch({ limit: 50 });
  const lastMessage = fetched.find(
    (m) => m.author.id === target.id && m.id !== message.id && !m.author.bot
  );

  if (!lastMessage || !lastMessage.content) {
    await message.channel.send(
      `**${target.displayName.toUpperCase()} IS NOW ABSOLUTELY ZOOTED, MAAAN!** 🌿💨`
    );
    await message.delete().catch(() => {});
    return;
  }

  const inserts = ["dude", "bro", "maaan", "like", "yo"];
  const exclaims = ["whoa", "far out", "totally", "no way", "for real"];
  const words = lastMessage.content.split(/\s+/);
  const mapped = words.map((w) => {
    if (Math.random() < 0.15)
      return w + "..." + inserts[Math.floor(Math.random() * inserts.length)];
    if (Math.random() < 0.1)
      return w.replace(/[aeiou]/gi, (v) => v + v);
    return w;
  });
  const zootedText =
    mapped.join(" ") +
    `, ${exclaims[Math.floor(Math.random() * exclaims.length)]} maaan 🌿`;

  try {
    await lastMessage.delete().catch(() => {});
  } catch {}

  const canWebhooks = bot.permissions.has("ManageWebhooks");
  if (canWebhooks) {
    try {
      const hook = await message.channel.createWebhook({
        name: target.displayName,
        avatar: target.user.displayAvatarURL({ format: "png" }),
      });

      await hook.send({
        content: zootedText,
        username: target.displayName,
        avatarURL: target.user.displayAvatarURL({ format: "png" }),
      });

      await new Promise((r) => setTimeout(r, 250));
      await hook.delete().catch(() => {});
    } catch (err) {
      console.error("Webhook failed:", err);
      await message.channel.send(
        `**${target.displayName}** (zooted): ${zootedText}`
      );
    }
  } else {
    await message.channel.send(
      `**${target.displayName}** (zooted): ${zootedText}`
    );
  }

  await message.channel.send(
    `**${target.displayName.toUpperCase()} IS NOW ABSOLUTELY ZOOTED, MAAAN!** 🌿💨`
  );

  try {
    await message.delete().catch(() => {});
  } catch {}
}
