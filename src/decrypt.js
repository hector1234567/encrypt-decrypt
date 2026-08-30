const fs = require("node:fs/promises");
const { Transform } = require("node:stream");
const { pipeline } = require("node:stream/promises");

const n = +process.argv[2] || 1;

class Decrypt extends Transform {
  constructor({ n }) {
    super();
    this.n = n;
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      chunk[i] = (chunk[i] + this.n) % 256;
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("files/encrypted.txt", "r");
  const writeFile = await fs.open("files/decrypted.txt", "w");

  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();
  const transformStream = new Decrypt({ n });

  try {
    await pipeline(readStream, transformStream, writeStream);
    console.log("Decrypted!");
  } catch (err) {
    console.error("Error:", err);
  }
})();
