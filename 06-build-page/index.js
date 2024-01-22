const fs = require('fs');
const path = require('path');

const FOLDER_NAME = 'project-dist';

async function buildPage() {
  const pathToTargetFolder = path.join(__dirname, FOLDER_NAME);

  const pathToSourceAssets = path.join(__dirname, 'assets');
  const pathToTargetAssets = path.join(__dirname, FOLDER_NAME, 'assets');

  const pathToSourceStyle = path.join(__dirname, 'styles');
  const pathToTargetStyle = path.join(__dirname, FOLDER_NAME, 'style.css');

  const pathToSourceHtml = path.join(__dirname, 'template.html');
  const pathToTargetHtml = path.join(__dirname, FOLDER_NAME, 'index.html');

  try {
    await fs.promises.rm(pathToTargetFolder, {
      recursive: true,
      force: true,
    });
    await fs.promises.mkdir(pathToTargetFolder, { recursive: true });
    await copyAssets(pathToSourceAssets, pathToTargetAssets);
    await mergeStyle(pathToSourceStyle, pathToTargetStyle);
    await bundleHtml(pathToSourceHtml, pathToTargetHtml);
  } catch (e) {
    process.stdout.write(e);
  }
}

async function copyAssets(sourceFolder, targetFolder) {
  try {
    await fs.promises.rm(targetFolder, { recursive: true, force: true });
    await fs.promises.mkdir(targetFolder, { recursive: true });

    const sourceFolderContent = await fs.promises.readdir(sourceFolder);

    sourceFolderContent.forEach(async (child) => {
      const pathToSourceFile = path.join(sourceFolder, child);
      const pathToTargetFile = path.join(targetFolder, child);
      const statChild = await fs.promises.stat(pathToSourceFile);

      if (statChild.isDirectory()) {
        copyAssets(pathToSourceFile, pathToTargetFile);
      } else {
        await fs.promises.copyFile(pathToSourceFile, pathToTargetFile);
      }
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

async function mergeStyle(sourceFolder, target) {
  try {
    const writeStream = new fs.createWriteStream(target);

    const sourceFolderContent = await fs.promises.readdir(sourceFolder, {
      withFileTypes: true,
    });

    sourceFolderContent.forEach(async (child) => {
      const pathToFile = path.join(sourceFolder, child.name);

      if (child.isFile() && path.extname(pathToFile) === '.css') {
        const readStream = fs.createReadStream(pathToFile);

        readStream.on('data', (chunk) => {
          writeStream.write(`${chunk}\n`);
        });
      }
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

async function bundleHtml(sourceFile, targetFile) {
  try {
    await fs.promises.copyFile(sourceFile, targetFile);

    let templateContent = await fs.promises.readFile(targetFile, 'utf-8');

    const components = await fs.promises.readdir(
      path.join(__dirname, 'components'),
      { withFileTypes: true },
    );

    components.forEach(async (component) => {
      const pathToFile = path.join(__dirname, 'components', component.name);

      if (component.isFile() && path.extname(pathToFile) === '.html') {
        const componentContent = await fs.promises.readFile(
          pathToFile,
          'utf-8',
        );

        templateContent = templateContent.replace(
          `{{${path.parse(pathToFile).name}}}`,
          componentContent,
        );

        const bundleWriteStream = await new fs.createWriteStream(targetFile);

        bundleWriteStream.write(templateContent);
      }
    });
  } catch (e) {
    process.stdout.write(e);
  }
}

buildPage();
