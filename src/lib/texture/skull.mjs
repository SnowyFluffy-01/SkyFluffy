import axios from "axios";
import fs from "graceful-fs";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import sharp from "sharp";
import path from "path";
import { promisify } from "util";

// i hated this so much please the offsets are not to be touched
// sincerely, snowyfluffy


// const itemsPath = path.resolve(
//   "public",
//   "items",
//   `${item.id.toLowerCase()}.png`
// );
const item =    {
  "material": "SKULL_ITEM",
  "durability": 3,
  "skin": {
    "value": "ewogICJ0aW1lc3RhbXAiIDogMTU5NTk1Mzg1NjA0MSwKICAicHJvZmlsZUlkIiA6ICI3MzgyZGRmYmU0ODU0NTVjODI1ZjkwMGY4OGZkMzJmOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJ4cWwiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvMzFmMzIwMDI1MTQyNTk2Mzk2MDMyY2MwMDg4ZTJhYzM2NDg5ZjI0Y2ZhNWU5ZGRhMTNlMDgxY2Y2OWY3N2Y0ZCIKICAgIH0KICB9Cn0=",
    "signature": "NS95wTTiRA+e+exZH7y3QpK+cD0urUgqiyQwK8l1kJGYDdfyf0BHSFN/HapJwFOZ7TB+HTa5BYRt8r8m6oF4M8SG+EaS09Y/iij2q+JHaBxG96ub5PJkTVjnYSZY5Uu6WU4tr6LuUUS5AJK9XGF8k0ui9+KFaXjIPNt9pgZUwHkmbNv55wWuUe/4nS/DsaowFQww4yyd5yljkMifbqBc4WwnOyE2TDGLwVwtGaQ6qWrmP59/vZSPLdTFNvoXvZhhUrr8jLdLOKFPo5w/UI8EhFh+vJS4JrYs4FGdLGV+5ia3jxgpq6YQBQFvxYX0DYLgL2D8jzdj+y3lw0E0vrA9tYqJNZxscIzZadPvlZfV/9lsBaCLxP1oQqYRbx2nBtqi+Rj350yYjt9zoOX/YgoAOYOuk4Bx7WsGIKxmSqnz2LijxTgDECZdRT2WG5nhiU1OxLZkice30cbK9mfCUiFNLiGvmr4OPBLl8EWdlYbRAOgHVAmrr+R/BPTrhGSG+/3wPnRzrli1EVkpLl1R9acHbljdHpV2vCokKlA4tioRXmhN/W9wo5pB2WAGbxkSNh1FHVItIIb8hYSF+dVg39IZbFS+XrgtvmwTF10slUn1ah/dH3iZ8tUOjJ8YZ9mC0eMlG5odI9XkO0NwiLYkTpq+ffJo18qKF+rwGLo5k2YmlYU="
  },
  "name": "Treasure Talisman",
  "category": "ACCESSORY",
  "tier": "RARE",
  "npc_sell_price": 1000,
  "dungeon_item": true,
  "salvages": [
    {
      "type": "ESSENCE",
      "essence_type": "GOLD",
      "amount": 15
    }
  ],
  "id": "TREASURE_TALISMAN"
}
const testPath = path.resolve("haha.png");
const readdir = promisify(fs.readdir);

const imageBuffers = {};
const overlayBuffers = {};
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

const faceCoords = {
  top: { x: 8, y: 0 },
  left: { x: 0, y: 8 },
  front: { x: 8, y: 8 },
};

async function hasOverlay(image) {
  const overlayImg = await sharp(image)
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

async function getSide(img, height, width, x, y) {
  const buf = await sharp(img)
    .extract({ left: x, top: y, width: 8, height: 8 })
    .resize({
      height: height,
      width: width,
      kernel: sharp.kernel.nearest,
    })
    .ensureAlpha()
    .toBuffer();
  return buf;
}

async function getSkinTextureFromEncoding(skin) {
  let skinUrl = Buffer.from(skin, "base64").toString("utf8");
  skinUrl = JSON.parse(skinUrl.replaceAll("\n", ""));
  let texture = await axios.get(skinUrl.textures.SKIN.url, {
    responseType: "arraybuffer",
  });
  let buffer = Buffer.from(texture.data);
  return buffer;
}

async function drawSide(ctx, side, img, x, y) {
  const skew = side == "left" ?5/9 : -5/9;
  const scaleY = side == "top" ? 5/9: 1;
  const skewX = side == "top" ? 1 : 0;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(50, 50);
  ctx.transform(1, skew, skewX, scaleY, 0, 0);
  ctx.drawImage(img, x, y);
}

async function loadHead() {
  try {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext("2d");

    // const files = await readdir(path.resolve("public", "items"));
    // if (
    //   files.includes(`${item.id}.png`) ||
    //   files.includes(`${item.id.toLowerCase()}.png`) ||
    //   item.material != "SKULL_ITEM" ||
    //   !item?.skin?.value
    // ) {
    //   continue;
    // }

    const imageBuffer = await getSkinTextureFromEncoding(item.skin.value);
    const { result, overlayImg = {} } = await hasOverlay(imageBuffer);
    console.log(result);
    for (const face of Object.keys(faceCoords)) {
      ctx.patternQuality = "fast";
      const { x, y } = faceCoords[face];
      imageBuffers[face] = await getSide(imageBuffer, 37, 37, x, y);
      if (result) {
        overlayBuffers[face] = await getSide(overlayImg, 40, 40, x, y);
      }
    }
    for (const [side, buffer] of Object.entries(imageBuffers)) {
      ctx.patternQuality = "fast";
      const { x, y } = drawCoords[side];
      const img = await loadImage(buffer);
      ctx.imageSmoothingEnabled = false;

      ctx.filter = side == "top" ? "none" : `brightness(70%)`;
      await drawSide(ctx, side, img, side =='top' ? x - 0.5 : x,  side =='top' ?y + 0.5 : y);
    }

    if (result) {
      for (const [side] of Object.entries(imageBuffers)) {
        const { x, y } = drawCoords[side];
        ctx.patternQuality = "fast";   
        const buffer2 = overlayBuffers[side];
        const ovrImg = await loadImage(buffer2);
        ctx.imageSmoothingEnabled = false;
        ctx.filter = side == "top" ? "none" : `brightness(65%)`;
        await drawSide(ctx, side, ovrImg, side == 'top' ? x-2 : x - 1, side =='top' ? y -1 : y  );
      }
    }
    const bufferOut = canvas.toBuffer("image/png");
    await sharp(bufferOut).toFile(testPath);
  } catch (e) {
    console.error(e);
  }
}

loadHead().catch(console.error);
