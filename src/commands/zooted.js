import { PermissionsBitField } from "discord.js";

export async function executeZooted(message) {
  const bot = message.guild.members.me;
  if (!bot?.permissions.has(PermissionsBitField.Flags.ManageMessages))
    return message.reply("I need ManageMessages permission to do that, maaan.");

  // fetch or create role
  let zootedRole = message.guild.roles.cache.find(r => r.name === "zooted");
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

  // command split
  const content = message.content.toLowerCase();
  const target = message.mentions.members.first();

  // --- unzoot command ---
  if (content.startsWith("!unzoot")) {
    if (!target)
      return message.reply("Tag someone to unzoot, maaan.");

    if (!target.roles.cache.has(zootedRole.id))
      return message.reply(`${target.displayName} isn’t even zooted, maaan.`);

    try {
      await target.roles.remove(zootedRole);
      await message.channel.send(
        `💨 **${target.displayName.toUpperCase()} HAS BEEN UNZOOTED!** Welcome back to sobriety, maaan.`
      );
      await message.delete().catch(() => {});
    } catch (err) {
      console.error("Role removal failed:", err);
      return message.reply("Could not unzoot them, maaan.");
    }
    return;
  }

  // --- zooted speech effect for users who have the role ---
  if (message.member.roles.cache.has(zootedRole.id) && !content.startsWith("!zooted")) {
    const inserts = ["dude", "bro", "maaan", "like", "yo"];
    const exclaims = ["whoa", "far out", "totally", "no way", "for real"];
    const words = message.content.split(/\s+/);
    const mapped = words.map(w => {
      if (Math.random() < 0.15)
        return w + "..." + inserts[Math.floor(Math.random() * inserts.length)];
      if (Math.random() < 0.1)
        return w.replace(/[aeiou]/gi, v => v + v);
      return w;
    });
    const zootedText =
      mapped.join(" ") +
      `, ${exclaims[Math.floor(Math.random() * exclaims.length)]} maaan 🌿`;

    try { await message.delete().catch(() => {}); } catch {}
    const canWebhooks = bot.permissions.has(PermissionsBitField.Flags.ManageWebhooks);
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
        await new Promise(r => setTimeout(r, 200));
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

  // --- !zooted command ---
  if (content.startsWith("!zooted")) {
    if (!target)
      return message.reply("Tag someone to zoot, maaan.");

    if (target.roles.cache.has(zootedRole.id))
      return message.reply(`${target.displayName} is already zooted, maaan.`);

    try {
      await target.roles.add(zootedRole);
    } catch (err) {
      console.error("Role assign failed:", err);
      return message.reply("Could not assign the role.");
    }

    // grab their last message to zootify
    const fetched = await message.channel.messages.fetch({ limit: 50 });
    const lastMessage = fetched.find(
      m => m.author.id === target.id && m.id !== message.id && !m.author.bot
    );

    const inserts = ["dude", "bro", "maaan", "like", "yo"];
    const exclaims = ["whoa", "far out", "totally", "no way", "for real"];
    const words = lastMessage?.content
      ? lastMessage.content.split(/\s+/)
      : ["..."];
    const mapped = words.map(w => {
      if (Math.random() < 0.15)
        return w + "..." + inserts[Math.floor(Math.random() * inserts.length)];
      if (Math.random() < 0.1)
        return w.replace(/[aeiou]/gi, v => v + v);
      return w;
    });
    const zootedText =
      mapped.join(" ") +
      `, ${exclaims[Math.floor(Math.random() * exclaims.length)]} maaan 🌿`;

    if (lastMessage) try { await lastMessage.delete().catch(() => {}); } catch {}

    const canWebhooks = bot.permissions.has(PermissionsBitField.Flags.ManageWebhooks);
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
        await new Promise(r => setTimeout(r, 200));
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

    await message.delete().catch(() => {});
    return;
  }
}
