import fs from "graceful-fs";
import animateTexture from "./animated.mjs";
import path from "path";
import { promisify } from "util";
import sharp from "sharp";
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const dirPath = path.resolve(
  "public",
  "textures",
  "assets",
  "minecraft",
  "mcpatcher",
  "cit"
);

async function moveStaticPicture(inputDir, outputDir) {

  await sharp(inputDir)
    .resize({
      width: 100,
      height: 100,
      kernel: sharp.kernel.nearest,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      fastShrinkOnLoad: false,
    })
    .toFormat("png", {
      compressionLevel: 9,
      palette: true
    })
    .toFile(outputDir);
}

export async function unifyTextureDir(currentDirPath) {
  try {
    let propertyCheck = true;
    const files = await readdir(currentDirPath);
    for (const file of files) {
      const fullPath = path.join(currentDirPath, file);
      const stats = await stat(fullPath);
      if (stats.isDirectory()) {
        if (file == "models" || file == "ui") {
          continue;
        }

        await unifyTextureDir(fullPath);
      } else if (stats.isFile()) {
        const id = file.split(".")[0].toLowerCase();
        let frameTime;
        let copy = false;
        if (path.extname(file) == `.png`) {
          if (files.includes(`${id}.png.mcmeta`)) {
            //This means its animated
            let data = await readFile(
              path.join(currentDirPath, `${id}.png.mcmeta`),
              "utf8"
            ); // id guranteed to work
            frameTime = JSON.parse(data);
            const stats = { frameTime, id, path: fullPath };
            await animateTexture(stats); // works perfectly
            continue;
          }
          // png not animated
          if (path.basename(currentDirPath) == "items") {
            // items dont have properties, move them right away
            await moveStaticPicture(
              fullPath,
              path.resolve("public", "items", `${id}.png`)
            );
            continue;
          }
          if (!files.includes(`${id}.properties`)) {
            continue;
            // not in items no properties useless poof
          }
          const properties = await readFile(
            path.join(currentDirPath, `${id}.properties`),
            "utf8"
          );

          const reg =
            /nbt\.ExtraAttributes\.id=(?:regex:)?(\w+)(?:\((\d)?\|(\d)?)?/im;
      
          const matches = properties.match(reg);
          if (!matches) {
            console.log(id + ' no match')
            continue;
          }
       
          let fileName = []
          if (matches[2] || matches[3]) {
            copy = true
            fileName[0] = matches[1] + matches[2];
            fileName[1] = matches[1] + matches[3]
          } else {
            fileName[0] = matches[1]
          }
            
          for (let name of fileName) {
            if (name) {
              const copyPath = path.resolve(
                "public",
                "items",
                name.toLowerCase() + ".png"
              );
              await moveStaticPicture(fullPath, copyPath);
            }
          }

        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}


unifyTextureDir(dirPath).catch(e => {
  console.error(e)
})