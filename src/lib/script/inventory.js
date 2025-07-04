const colorCodes = {
  "§0": "#000000",
  "§1": "#0000AA",
  "§2": "#00AA00",
  "§3": "#00AAAA",
  "§4": "#AA0000",
  "§5": "#AA00AA",
  "§6": "#FFAA00",
  "§7": "#AAAAAA",
  "§8": "#555555",
  "§9": "#5555FF",
  "§a": "#55FF55",
  "§b": "#55FFFF",
  "§c": "#FF5555",
  "§d": "#FF55FF",
  "§e": "#FFFF55",
  "§f": "#FFFFFF",
};

const itemStats = {
  Damage: 0,
  Strength: 0,
  "Crit Chance": 0,
  "Crit Damage": 0,
  Ferocity: 0,
  Health: 0,
  Defense: 0,
};

const items = [];
const armorDisplay = [];
const chest = [];
const accBag = [];
const equipmentDisplay = [];

const regex =
  /(§.)?(damage|strength|crit.[chance|damage]+|ferocity|health|defense):.(..)?[+-]?(\d+[,.0-9]?\d*)(%)?/gim;

export default async function parseInv(
  inv,
  armor,
  ender,
  talismans,
  equipment
) {
  try {
    [inv, armor, ender, equipment, talismans].forEach((group, gIndex) => {
      const arrToUse =
        gIndex === 0
          ? items
          : gIndex === 1
          ? armorDisplay
          : gIndex === 2
          ? chest
          : gIndex === 3
          ? accBag
          : equipmentDisplay;
      group.i.forEach((it, index) => {
        const lore = it?.tag?.display?.Lore;
        arrToUse[index] = arrToUse[index] || {};
        arrToUse[index].name = it?.tag?.display?.Name;
        arrToUse[index].lore = lore;
        arrToUse[index].id = it?.tag?.ExtraAttributes?.id;
        console.log(it)
        // Get stats from items
        if (group == equipment || group == armor || group == talismans) {
          const matches =
            lore &&
            lore.flatMap((line) => {
              return typeof line === "string" ? [...line.matchAll(regex)] : [];
            });

          matches &&
            matches.forEach((match) => {
              match != [] ? (itemStats[match[2]] += Number(match[4])) : null;
            });
        }
      });
    });
    itemStats["Crit Chance"] = itemStats["Crit Chance"] + "%";
    itemStats["Crit Damage"] = itemStats["Crit Damage"] + "%";

    return { items, armorDisplay, chest, accBag, equipmentDisplay };
  } catch (e) {
    console.error(e);
  }
}

// 11:41PM. 19/5/2025 IT WORKS FINALLY IM JSO DONE I FORGOT TO PUT EQUIPMENT IN THE .FOREACH ARRAY SOBBING
