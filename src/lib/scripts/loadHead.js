
import axios from "axios";
import { readdir } from "fs/promises";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import sharp from "sharp";
import path from "path";
// i hated this so much please the offsets are not to be touched
// sincerely, snowyfluffy



export default async function loadHead(texture, id) {
  const imgBuffers = {};
  const overlayBuffers = {};
  // most coords here make sense, left side goes -width, top - height and front doesn't need to be moved
  // (in translated context)
  const drawCoords = {
    top: {
      x: 0,
      y: -37,
    },
    left: {
      x: -37,
      y: 0,
    },
    front: {
      x: 0,
      y: 0,
    },
  };

  // 8 pixels per face in uv map provided in textures.minecrafr
  const extractCoords = {
    top: { x: 8, y: 0 },
    left: { x: 0, y: 8 },
    front: { x: 8, y: 8 },
  };

  const files = await readdir(path.resolve("public", "items"));
  // async function doesExist(paths) {
  //   try {
  //     const checks = paths.map(path => {
  //       access(path).then(() => true).catch(() => false)
  //     })
  //     const results = await Promise.all(checks)

  //     return results
  //   } catch (e) {
  //     console.log("i have no idea: " + e );
  //   }
  // }

  async function getSkinTextureFromEncoding() {
    try {

      let skinUrl = Buffer.from(texture, "base64").toString("utf8");
      skinUrl = JSON.parse(skinUrl.replaceAll("\n", ""));
      const res = await axios.get(skinUrl.textures.SKIN.url, {
        responseType: "arraybuffer",
      });
      const buffer = Buffer.from(res.data);
      return buffer;
    } catch(e) {
      console.error(e.message);
      throw e
    }
  }

  async function getSide(img, height, width, x, y) {
    const buffer = await sharp(img)
      // you already know why 8
      .extract({ left: x, top: y, width: 8, height: 8 })
      .resize({
        height: height,
        width: width,
        kernel: sharp.kernel.nearest,
      })
      .ensureAlpha()
      .toBuffer();
    return buffer;
  }

  async function drawSide(ctx, side, img, x, y) {
    // 5/9 approx. same value as tan(30) but less floating numbers
    const skew = side == "left" ? 26 / 45 : -26 / 45;
    const scaleY = side == "top" ? 26 / 45 : 1;
    const skewX = side == "top" ? 1 : 0; // makes top look flat
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(50, 50); // midpoint
    ctx.transform(1, skew, skewX, scaleY, 0, 0);
    ctx.drawImage(img, x, y);
  }

  async function hasOverlay(img) {
    const overlayImg = await sharp(img)
      //again, refer to the uv map texture
      .extract({
        left: 8 * 4,
        top: 0,
        height: 8 * 2,
        width: 8 * 4,
      })
      .ensureAlpha()
      .toBuffer();

    for (let i = 3; i < overlayImg.length; i += 4) {
      if (overlayImg[i] != 0) {
        return { result: true, overlayImg };
      }
    }
    return { result: false };
  }
  try {

      // if(files.includes(`${id}.png`)) return
    
      const canvas = createCanvas(100, 100); // all texture items have this 100x100 in SkyFluffy
      const ctx = canvas.getContext("2d");

      const imgBuffer = await getSkinTextureFromEncoding();
      const { result, overlayImg = {} } = await hasOverlay(imgBuffer);
      for (const side of Object.keys(extractCoords)) {
        const { x, y } = extractCoords[side];
        imgBuffers[side] = await getSide(imgBuffer, 37, 37, x, y); // base is approx. 0.94 the scale of overlay to add depth
        if (result) {
          overlayBuffers[side] = await getSide(overlayImg, 40, 40, x, y); // 40 here so that when all sides drawn fit into standard 100x100
        }
      }
      for (const [side, buffer] of Object.entries(imgBuffers)) {
        const { x, y } = drawCoords[side];
        const offsetX = side == "top" ? x - 1.5 : x;
        const offsetY = side == "top" ? y + 0.5 : y;
        const img = await loadImage(buffer);
        ctx.imageSmoothingEnabled = false;
        ctx.filter = side == "top" ? "none" : `brightness(65%)`; // darker base under top for 3d faking

        await drawSide(ctx, side, img, offsetX, offsetY);
      }

      if (result) {
        for (const [side] of Object.entries(imgBuffers)) {
          const { x, y } = drawCoords[side];
          const offsetX = side == "top" ? x - 3 : x - 1;
          const offsetY = side == "top" ? y - 1 : y;
          const overlayBuffer = overlayBuffers[side];
          const overlayImg = await loadImage(overlayBuffer);
          ctx.imageSmoothingEnabled = false;
          ctx.filter = side == "top" ? "none" : `brightness(70%)`; // a little more bright to stand out

          await drawSide(ctx, side, overlayImg, offsetX, offsetY);
        }
      }
      const bufferOut = canvas.toBuffer("image/png");
      await sharp(bufferOut).toFile(path.resolve("public", "items", `${id}.png`));
    
  } catch (e) {
    console.error(e);
    throw e;
  }
}

