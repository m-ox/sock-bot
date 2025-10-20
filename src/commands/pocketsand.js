import { AttachmentBuilder } from 'discord.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function handlePocketSand(message) {
  try {
    const gifPath = path.join(__dirname, '../../images', 'pocketsand.gif');
    const attachment = new AttachmentBuilder(gifPath);
    await message.channel.send({ files: [attachment] });
  } catch (err) {
    console.error('GIF send failed (pocket sand):', err);
  }
}
