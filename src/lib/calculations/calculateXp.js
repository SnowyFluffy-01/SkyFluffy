

import xpTables from '../constants/xpTables.json' with { type: 'json'}

export default function calcXp(x, name, ranked) {
const levels = xpTables.leveling_xp;
const runecrafting = xpTables.runecrafting_xp
const social = xpTables.social;
const dungeoneering = xpTables.catacombs;
ranked ? null : xpTables.leveling_caps["runecrafting"] = 3
let xp = Math.floor(Number(x))
 let level = 0;
 let nextXp
 let overflow;
 const mapToUse = name == "runecrafting" ? runecrafting : name == "social" ? social: name =="dungeoneering" ? dungeoneering : levels;
 const maxLevel = xpTables.leveling_caps[name]
for(let value of mapToUse) {
    if(xp >= value && level < maxLevel) {
        xp -= value;
        level++
      }  else if(xp < value && level < maxLevel){
        nextXp = value;
        break;
    } 
    if(level >=maxLevel) {
      overflow = xp;
      break;
    }
}
return {xp, level, nextXp, overflow}
}



