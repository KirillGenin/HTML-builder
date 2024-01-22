const fs = require('fs');
const path = require('path');

const pathToSourceFolder = path.join(__dirname, 'styles');
const pathToTargetFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles(sourceFolder, target) {
  try {
    const writeStream = new fs.createWriteStream(target);

    const sourceFolderContent = await fs.promises.readdir(sourceFolder, {
      withFileTypes: true,
    });

    sourceFolderContent.forEach(async (child) => {
      const pathToFile = path.join(sourceFolder, child.name);

      if (child.isFile() && path.extname(pathToFile) === '.css') {
        const readStream = fs.createReadStream(pathToFile);
        readStream.pipe(writeStream);
      }
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

mergeStyles(pathToSourceFolder, pathToTargetFile);
