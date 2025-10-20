export default function ready(client) {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "lurking", type: 0 }],
    status: "online",
  });
}
