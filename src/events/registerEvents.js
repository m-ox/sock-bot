import ready from "./ready.js";
import messageCreate from "./messageCreate.js";
import { Events } from "discord.js";

export function registerEvents(client) {
  client.once(Events.ClientReady, () => ready(client));
  client.on(Events.MessageCreate, (message) => messageCreate(message, client));
}
