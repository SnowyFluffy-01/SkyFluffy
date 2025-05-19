import nbt from 'prismarine-nbt'

export default function parseNbt(nb) {
  return new Promise((resolve, reject) => {
    let buf = Buffer.from(nb, 'base64');
    nbt.parse(buf, (e, dat) => {
      if (e) reject(e);
      else resolve(nbt.simplify(dat));
    });
  });
}