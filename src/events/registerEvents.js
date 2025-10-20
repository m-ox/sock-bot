import ready from "./ready.js";
import messageCreate from "./messageCreate.js";

export function registerEvents(client) {
  client.once("ready", () => ready(client));
  client.on("messageCreate", (message) => messageCreate(message, client));
}
