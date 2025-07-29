import loadHead from "../scripts/loadHead.js";
import parseNbt from "./parseNbt.js";
import {vanillaItems} from '../constants/vanillaItems.js' 
import getPathFromJSON from "../scripts/getPathFromJSON.js";
import path from "path";
import { readdir } from "fs/promises";

const itemStats = {
  Damage: 0,
  Strength: 0,
  "Crit Chance": 0,
  "Crit Damage": 0,
  Ferocity: 0,
  Health: 0,
  Defense: 0,
};

const statRegex =
  /(§.)?(damage|strength|crit.[chance|damage]+|ferocity|health|defense):.(..)?[+-]?(\d+[,.0-9]?\d*)(%)?/gim;

const codes = {
  "§0": "color: #000000",
  "§1": "color: #0000AA",
  "§2": "color: #00AA00",
  "§3": "color: #00AAAA",
  "§4": "color: #AA0000",
  "§5": "color: #AA00AA",
  "§6": "color: #FFAA00",
  "§7": "color: #AAAAAA",
  "§8": "color: #555555",
  "§9": "color: #5555FF",
  "§a": "color: #55FF55",
  "§b": "color: #55FFFF",
  "§c": "color: #FF5555",
  "§d": "color: #FF55FF",
  "§e": "color: #FFFF55",
  "§f": "color: #FFFFFF",
  "§l": "font-weight: bold",
  "§o": "font-style = italic",
};

const colorReg = /(§[0-9A-Za-z])(§[0-9A-Za-z])?(§[0-9A-Za-z])?(§[0-9A-Za-z])?([^§]*)/g;
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
    const parsed = await parseNbt(inv);
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

      const matches = [];
      const formattedLore = [];
      const toParse = lore ? [name, ...lore] : name ? [name] : null;
      const checkStats =
        type == "talisman" || type == "equipment" || type == "armor";

      if (toParse) {
        for (const line of toParse) {
          if (line == "") {
            formattedLore.push('<div style= "margin: 1rem 0"></div>');
            continue;
          }

          const formattedLine = line.replace(
            colorReg,
            (_, code1, code2, code3, code4, text) => {
              if (code1 || code2 || code3 || code4) {
                if (
                  code1 == "§r" ||
                  code2 == "§r" ||
                  code3 == "§r" ||
                  code4 == "§r"
                ) {
                  return text;
                }
                return `<span style = "${codes[code1] || ""}; ${
                  codes[code2] || ""
                }; ${codes[code3] || ""}; ${
                  codes[code4] || ""
                }" >${text}</span>`;
              } else if (text) {
                return text;
              } else {
                console.log(line);
                return _;
              }
            }
          );
          formattedLore.push(formattedLine);
          if (line && checkStats) {
            matches.push(...line.matchAll(statRegex));
          }
        }
      }

      matches &&
        matches.forEach((match) => {
          match != [] ? (itemStats[match[2]] += Number(match[4])) : null;
        });

      const formattedName = formattedLore[0];
      obj.name = formattedName;
      obj.lore = formattedLore.slice(1);
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

    itemStats["Crit Chance"] += "%";
    itemStats["Crit Damage"] += "%";
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
