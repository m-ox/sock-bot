import { executeZooted } from "./zooted.js";
import { executeCursed, executePurify } from "./cursed.js";

export const effects = {
  zooted: executeZooted,
  curse: executeCursed,
  purify: executePurify,
};

export function applyEffect(roleName, message) {
  const effect = effects[roleName];
  if (!effect) return null;
  return effect(message);
}
