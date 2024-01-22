const fs = require('fs/promises');
const path = require('path');

const pathToSourceFolder = path.join(__dirname, 'files');
const pathToTargetFolder = path.join(__dirname, 'files-copy');

async function copyDir(sourceFolder, targetFolder) {
  try {
    await fs.rm(targetFolder, { recursive: true, force: true });
    await fs.mkdir(targetFolder, { recursive: true });

    const sourceFolderContent = await fs.readdir(sourceFolder);

    sourceFolderContent.forEach(async (child) => {
      const pathToSourceFile = path.join(sourceFolder, child);
      const pathToTargetFile = path.join(targetFolder, child);

      const statChild = await fs.stat(pathToSourceFile);
      if (statChild.isDirectory()) {
        copyDir(pathToSourceFile, pathToTargetFile);
      } else await fs.copyFile(pathToSourceFile, pathToTargetFile);
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

copyDir(pathToSourceFolder, pathToTargetFolder);
