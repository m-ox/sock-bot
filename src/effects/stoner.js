export function stonerize(text) {
  const inserts = ['dude', 'bro', 'maaan', 'like', 'yo'];
  const exclaims = ['whoa', 'far out', 'totally', 'no way', 'for real'];
  const words = text.split(/\s+/);

  const mapped = words.map(w => {
    if (Math.random() < 0.15) return w + '...' + inserts[Math.floor(Math.random() * inserts.length)];
    if (Math.random() < 0.1) return w.replace(/[aeiou]/gi, v => v + v);
    return w;
  });

  const joined = mapped.join(' ');
  const tag = exclaims[Math.floor(Math.random() * exclaims.length)];
  return `${joined}, ${tag} maaan 🌿`;
}
