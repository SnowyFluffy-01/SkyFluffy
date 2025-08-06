import { readdir, readFile } from "fs/promises";
import path from "path";
import petNums from "../constants/petnums.json"  with {type: 'json'}
import pets from "../constants/pets.json" with {type: "json"};
import calcXp from "../calculations/calculateXp.js";
import parseLore from "./parseLore.js";
import loadHead from "../scripts/loadHead";
import formatNumber from "../utils/formatNumber.js";

const tierMap = {
  MYTHIC: 5,
  LEGENDARY: 4,
  EPIC: 3,
  RARE: 2,
  UNCOMMON: 1,
  COMMON: 0,
};
const dir = path.resolve("src", "lib", "constants", "neuitems");
const files = await readdir(dir);
const filesSet = new Set(files);

export default async function parsePets(petData) {
  // add loop
    try {
        const arr = [];
        const headPromises = [];
        if (!petData) return;
        for (const pet of petData) {
            const obj = {};
            const tier = tierMap[pet.tier];

            const petLookup = `${pet.type};${tier}.json`;

            let petJSON =
                filesSet.has(petLookup) && (await readFile(path.join(dir, petLookup)));
            petJSON = petJSON && JSON.parse(petJSON);

            const match = petJSON.nbttag && petJSON.nbttag.match(/Value:"([^"]+)/);
            const nbttag = match[1];

            nbttag && headPromises.push({ texture: nbttag, id: `SKULL_${pet.type}` });
            const offSet = pets.pet_rarity_offset[pet.tier];
            const isNormalPet = !(pet.type in pets);

            const levelMap =
                isNormalPet && pets.pet_levels.map((level) => (level += offSet));
            const { level, xp, nextXp } = calcXp(
                pet.exp,
                "pet",
                false,
                levelMap,
                isNormalPet ? 100 : 200
            );

            const mainStat = petNums[pet.type][pet.tier][100].statNums;

            const replaceRegex = mainStat && new RegExp(`{(${Object.keys(mainStat).join("|")})}|{(\\d+)}`, 'g');


            const lore = [];
            const name = petJSON.displayname.replace(`{LVL}`, level);
            lore.push(name);
            for (const line of petJSON.lore) {
                if (line == "") {
                    lore.push('<div style= "margin: 1rem 0"></div>');
                    continue;
                }
                if (!line) continue;
                const formattedLine = line.replace(
                    replaceRegex,
                    (_, stat, index) => {
                        if (stat) {
                            return line.includes('+') ? formatNumber((mainStat[stat] / 100) * level) : ('+' + formatNumber((mainStat[stat] / 100) * level))
                        }
                        if (index) {
                            return (formatNumber(petNums[pet.type][pet.tier][100].otherNums[index] / 100 * level));
                        }
                        return
                    }
                );
                lore.push(formattedLine);
            }

            // push progress to next level and candies used and to0tal xp to lore
            const progressText = nextXp
                ? `§7Porgress to Level ${level + 1}: §e${formatNumber((xp / nextXp) * 100)}%`
                : "§bMAX LEVEL";
            const str = "--------------------";
            const progressInt = nextXp && parseInt((xp / nextXp) * (str.length - 1));

            const passed = nextXp && `§2${str.slice(0, progressInt)}`;
            const progressBar =
                nextXp && `${passed}§f${str.slice(progressInt)} §e${xp} §6/ §e${nextXp}`;
            const total = `§7Total XP: §e${formatNumber(
                pet.exp
            )} §6/ §e${formatNumber(levelMap[levelMap.length - 1])} §6(${formatNumber(
                (pet.exp / levelMap[levelMap.length - 1]) * 100
            )}%)`;
            const candyUsed = `§7Candy Used: §e${pet.candyUsed} §6/ §e10`;
            lore.push("", progressText, nextXp ? progressBar : null, "", total, candyUsed);

            const formattedLore = parseLore(lore, true);

            const nameOut = formattedLore && formattedLore[0];
            const loreOut = formattedLore.slice(1);

            obj.src = `SKULL_${pet.type}`;
            obj.name = nameOut;
            obj.lore = loreOut;
            obj.tier = tier;
            obj.exp = pet.exp;
            obj.level = level
            arr.push(obj);
        }
        const promises = headPromises.map(async ({ texture, id }) =>
            loadHead(texture, id)
        );
        await Promise.all(promises);
        return arr.sort((a, b) => {
            if (a.tier !== b.tier) {
              return b.tier - a.tier
            }
           return b.exp - a.exp
        })
  } catch (e) {
    console.error(e);
  }
}
