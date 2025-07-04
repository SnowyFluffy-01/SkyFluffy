import sharp from "sharp";
import apng from "sharp-apng";
import path from "path";
export default async function animateTexture(stats) {
  try {
    const metaData = await sharp(stats.path).metadata();
    const frames = [];
    const framesNumber = Math.floor(metaData.height / metaData.width);
    const fHeight = Math.floor(metaData.height / framesNumber);
    const delay = stats.frameTime.animation.frametime * 50;

    for (let y = 0; y < metaData.height; y += fHeight) {
      const frame = sharp(stats.path)
        .extract({
          top: y,
          left: 0,
          width: metaData.width,
          height: fHeight,
        })
        .resize(100, 100, {
          kernel: sharp.kernel.nearest,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          fastShrinkOnLoad: false,
        });
      frames.push(frame);
    }

    await apng.framesToApng(
      frames,
      path.resolve("public", "items", `${stats.id}.png`),
      {
        delay: delay,
        height: 100,
        width: 100,
      }
    );
  } catch (e) {
    console.error("Animation failed ", e);
  }
}
