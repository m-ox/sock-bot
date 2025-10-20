import ready from './ready.js';
import messageCreate from './messageCreate.js';

export function registerEvents(client) {
  client.once('clientReady', ready);
  client.on('messageCreate', messageCreate);
}
