const globalLoreStats = {
};

const statRegex =
  /(§.)?(damage|strength|crit damage|ferocity|health|defense|(?:farming|foraging|mining|alchemy|carpentry|combat|enchanting|fishing|runecrafting|social|taming) (?:fortune|wisdom)|(?:mining|gemstone) (?:spread)|pristine|breaking power|vitality|mending|swing range|true defense|bonus attack speed|fishing speed|(?:sea creature|double hook|trophy fish|treasure|bonus pest|crit) chance|speed|magic find|pet luck|(?:heat|cold) resistance|fear):.(§.)?[+-]?(\d+[,.0-9]*)(%)?/gim;

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

const colorReg =
  /(§[0-9A-Za-z])(§[0-9A-Za-z])?(§[0-9A-Za-z])?(§[0-9A-Za-z])?([^§]*)/g;

export default function parseLore(toParse, checkStats = false) {
    const matches = [];
    const itemStats = {}
  const formattedLore = [];
  if (!toParse) {
    return
  }
  for (const line of toParse) {
    if (line == "") {
      formattedLore.push('<div style= "margin: 1rem 0"></div>');
      continue;
    }
 if(!line) {
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
          }; ${codes[code3] || ""}; ${codes[code4] || ""}" >${text}</span>`;
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

  matches &&
    matches.forEach((match) => {
        itemStats[match[2]] += Number(match[4]);
        globalLoreStats[match[2]] += Number(match[4])
    });

    
    // itemStats["Crit Chance"] += "%";
  // itemStats["Crit Damage"] += "%";
  return formattedLore
}
