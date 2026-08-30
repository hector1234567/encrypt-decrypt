const fs = require("node:fs/promises");
const { Transform } = require("node:stream");

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
  const readFile = await fs.open("encrypted.txt", "r");
  const writeFile = await fs.open("decrypted.txt", "w");

  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const transformStream = new Decrypt({ n: 45 });

  readStream.pipe(transformStream).pipe(writeStream);

  transformStream.on("end", () => console.log("Decrypted!"));
})();
