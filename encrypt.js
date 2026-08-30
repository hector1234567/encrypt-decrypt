const fs = require("node:fs/promises");
const { Transform } = require("node:stream");

class Encrypt extends Transform {
  constructor({ num }) {
    super();
    this.num = num;
  }

  _transform(chunk, encoding, callback) {
    for (let i = 0; i < chunk.length; i++) {
      chunk[i] = (((chunk[i] - this.num) % 256) + 256) % 256;
    }
    this.push(chunk);
    callback();
  }
}

(async () => {
  const readFile = await fs.open("source.txt", "r");
  const writeFile = await fs.open("encrypted.txt", "w");

  const readStream = readFile.createReadStream();
  const writeStream = writeFile.createWriteStream();

  const transformStream = new Encrypt({ num: 45 });

  readStream.pipe(transformStream).pipe(writeStream);

  transformStream.on("end", () => console.log("Encrypted!"));
})();
