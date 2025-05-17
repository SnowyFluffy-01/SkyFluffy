
import nbt from 'prismarine-nbt'
let colorCodes = {
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
"§f": "#FFFFFF"
}
export default async function parseInv(inv) {
  try {
    // ultimately the function is supposed to return the inventory data in a formulated way
    // so that i can have objects with the lore as the following
    // let item = {
    //   name: null,
    //   lore: null,
    //   id : null
    // }
    
    // then i need to get the stats out of each item ( itemstats will store value of all stats gained by items that are processed here)
    let itemStats = {
      Damage: 0,
      Strength: 0,
      'Crit Chance': 0,
      'Crit Damage': 0,
      Ferocity: 0,
      Health: 0,
      Defense: 0
    }
    let items =[]
    let buf = Buffer.from(inv, 'base64');
      nbt.parse(buf, (e, data) => {
        if (e) throw(e)
        let invData = nbt.simplify(data);
        invData.i.forEach((it, index) => {
          // TODO: start by printing out the stats from each item + color
          let item ={}
          let regex = /(§.)(damage|strength|crit.[chance|damage]+|ferocity|health|defense):.(..)[+-]?(\d+.)/gmi
         let lore =it?.tag?.display?.Lore
         let matches = lore && lore.flatMap(line => {
         return typeof line === 'string' ? [...line.matchAll(regex)] : [];
         }) 
     
         // corre
       matches && matches.forEach(match => {
         match != [] ? itemStats[match[2]] += Number(match[4]) : null
        })
        console.log(itemStats)
      })})
  } catch (e) {
    console.error(e)
  }
}


