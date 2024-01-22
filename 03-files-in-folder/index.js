const fs = require('fs/promises');
const path = require('path');

const FOLDER_NAME = 'secret-folder';
const pathToFolder = path.join(__dirname, FOLDER_NAME);

const getStatFileInFolder = async (pathToFolder) => {
  try {
    const folderContent = await fs.readdir(pathToFolder, {
      withFileTypes: true,
    });

    folderContent.forEach(async (child) => {
      if (child.isFile()) {
        const pathToFile = path.join(pathToFolder, child.name);
        const fileName = path.parse(pathToFile).name;
        const fileExt = path.extname(pathToFile).slice(1);

        const statChild = await fs.stat(pathToFile);
        const fileSize = (statChild.size / 1024).toFixed(3);

        process.stdout.write(`${fileName} - ${fileExt} - ${fileSize}kB\n`);
      }
    });
  } catch (e) {
    process.stdout.write(`${e}`);
  }
};

getStatFileInFolder(pathToFolder);
