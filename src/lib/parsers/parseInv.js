import loadHead from "../scripts/loadHead.js";
import parseNBT from "./parseNBT.js";
import {vanillaItems} from '../constants/vanillaItems.js' 
import getPathFromJSON from "../scripts/getPathFromJSON.js";
import path from "path";
import { readdir } from "fs/promises";
import parseLore from "./parseLore.js";
const models = await readdir(
  path.resolve("public", "textures", "assets", "firmskyblock", "models", "item")
);

const items = await readdir(
  path.resolve(
    "public",
    "textures",
    "assets",
    "cittofirmgenerated",
    "textures",
    "item"
  )
);

const itemsSet = new Set(items);
const modelsSet = new Set(models);

function getVanillaTexture(id) {
  const found = vanillaItems.find((item) => item.id == id);
  return found?.name;
}

export default async function parseInv(inv, type) {
  let arr = [];

  try {
    const parsed = await parseNBT(inv);
    const srcChecks = parsed.i.map((item) => {
      if (!item) return Promise.resolve(null);
      const id1 = item?.tag?.ExtraAttributes?.id;
      return modelsSet.has(id1?.toLowerCase() + ".json")
        ? getPathFromJSON(item)
        : Promise.resolve(null);
    });
    const textureChecks = parsed.i.map((item) => {
      if (!item) return Promise.resolve(null);
      const id2 = item?.tag?.ExtraAttributes?.id;
       const model2 = item?.tag?.ExtraAttributes?.model;
      const skullName2 = model2 ? `SKULL_${id2}_${model2}` : `SKULL_${id2}`;
      const texture2 = item.tag?.SkullOwner?.Properties?.textures[0]?.Value;
      return texture2 ? loadHead(texture2, skullName2) : Promise.resolve(null);
    });

  
    for (const item of parsed.i) {
      if (!item) {
        arr.push({});
        continue;
      }
      const obj = {};
      const name = item?.tag?.display?.Name;
      const lore = item?.tag?.display?.Lore;
      const id = item?.tag?.ExtraAttributes?.id;
       const model = item?.tag?.ExtraAttributes?.model;
      const skullName = model ? `SKULL_${id}_${model}` : `SKULL_${id}`;
      const vanillaName = getVanillaTexture(item.id);
      
      const texture = item.tag?.SkullOwner?.Properties?.textures[0]?.Value;
      let src;
      if (!src && id) {
        if (itemsSet.has(id.toLowerCase() + ".png")) {
          src = id;
        } else if (texture) {
          src = skullName;
        } else if (vanillaName) {
          src =
            vanillaName.split("_")[0] == "wooden"
              ? `wood_${vanillaName.split("_").slice(1)}`
              : vanillaName.split("_")[0] == "golden"
              ? `gold_${vanillaName.split("_").slice(1)}`
              : vanillaName;
        } else {
          src = "notFound";
        }
      }

 
      const toParse = lore ? [name, ...lore] : name ? [name] : null;
      const checkStats =
        type == "talisman" || type == "equipment" || type == "armor";

    const formattedLore = parseLore(toParse, checkStats)
    

      const formattedName = formattedLore && formattedLore[0];
      obj.name = formattedName;
      obj.lore = formattedLore && formattedLore.slice(1);
      obj.id = id;
      obj.src = src;
      arr.push(obj);
    }

    await Promise.all(textureChecks);
    const paths = await Promise.all(srcChecks);
    arr = arr.map((item, index) => {
      const src = paths[index];
      return {
        ...item,
        src: src ? src : item.src
      };
    });

    if (type == "inventory") {
      const firstRow = arr.slice(0, 9);
      const secondRow = arr.slice(9, 18);
      const thirdRow = arr.slice(18, 27);
      const fourthRow = arr.slice(27, 36);
      const formattedArr = [
        ...firstRow,
        ...fourthRow,
        ...thirdRow,
        ...secondRow,
      ];
      return formattedArr.reverse();
    } else {
      return arr;
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

// 11:41PM. 19/5/2025 IT WORKS FINALLY IM JSO DONE I FORGOT TO PUT EQUIPMENT IN THE .FOREACH ARRAY SOBBING
