const fs = require('fs');
const path = require('path');

const pathTofile = path.join(__dirname, 'text.txt');

const readStream = new fs.createReadStream(pathTofile);
readStream.pipe(process.stdout);
