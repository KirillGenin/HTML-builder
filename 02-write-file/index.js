const fs = require('fs');
const path = require('path');

const pathTofile = path.join(__dirname, 'text.txt');
const writeStream = new fs.createWriteStream(pathTofile);

process.stdout.write(
  'Please enter text.\nNote: To exit, use CTRL+C or type exit.\n> ',
);

process.stdin.on('data', (data) => {
  if (data.toString().trim().toLowerCase() === 'exit') {
    process.exit();
  } else {
    writeStream.write(data);
    process.stdout.write('> ');
  }
});

process.on('SIGINT', () => process.exit());

process.on('exit', () => process.stdout.write('\nFile writing completed.\n'));
