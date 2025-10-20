import { stonerize } from './stoner.js';
import { executeCursed } from './cursed.js';
import { executePurify } from './purify.js';

export const effects = {
  zooted: stonerize,
  curse: executeCursed,
  purify: executePurify,
};

export function applyEffect(roleName, message) {
  const transform = effects[roleName];
  if (!transform) return null;
  return transform(message.content);
}
