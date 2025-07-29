import sharp from "sharp";
import apng from "sharp-apng";
import path from "path";
import {readFile, readdir }from 'fs/promises'

 const files = await readdir(path.resolve("public", "items"));

export default async function animateSprites() {

  try {
    for (const file of files) {
      if (file.split('.')[2] != "mcmeta") continue
        console.log(file)
        const itemPng = file.split('.')[0] + '.png'
        const itemDir = path.resolve("public", "items")
        const itemPath = path.join(itemDir, itemPng)
        const metaData = await sharp(itemPath).metadata();
        const frames = [];
        const framesNumber = Math.floor(metaData.height / metaData.width);
        const fHeight = Math.floor(metaData.height / framesNumber);
      
        const data = await readFile(
          path.join(itemDir, file.split('.')[0] + ".png.mcmeta"),
          "utf-8"
        );
        const json = JSON.parse(data)
        const frameTime = json.animation.frametime
        const delay = frameTime * 50;
        for (let y = 0; y < metaData.height; y += fHeight) {
          const frame =  sharp(itemPath)
            .extract({
              top: y,
              left: 0,
              width: metaData.width,
              height: fHeight,
            })
          .resize({
            height: 100,
            width: 100,
            kernel: sharp.kernel.nearest
          })
            
          frames.push(frame);
        }

        
        await apng.framesToApng(
          frames,
          itemPath,
          {
            delay: delay,
            height: 100,
            width: 100,
          }
        );
      
    }
  } catch (e) {
    console.error("Animation failed ", e);
  }
}
await animateSprites()
