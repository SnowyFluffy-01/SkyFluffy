
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

  let itemStats = {
      Damage: 0,
      Strength: 0,
      'Crit Chance': 0,
      'Crit Damage': 0,
      Ferocity: 0,
      Health: 0,
      Defense: 0
    }

    let items =[];
    let armorDisplay =[]
    let chest = [];
    let accBag = [];
    let equipmentDisplay = [];
    let armorHealth, eqHealth, accHealth = {}
    let regex = /(§.)?(damage|strength|crit.[chance|damage]+|ferocity|health|defense):.(..)?[+-]?(\d{2,3})(%)?/gim

export default async function parseInv(inv,armor,ender, equipment, talismans) {
  try {
 

        [inv,armor,ender,talismans, equipment].forEach(group => {
   var arrToUse = group == inv ? items : group == armor ? armorDisplay : group ==  ender ? chest : group ==talismans ? accBag : equipmentDisplay
       group.i.forEach((it, index) => {
      
         let lore =it?.tag?.display?.Lore
         let ind = index 
      
         arrToUse[ind] = items[ind] || {}
         arrToUse[ind].name = it?.tag?.display?.Name;
         arrToUse[ind].lore = lore;
         arrToUse[ind].id = it?.tag?.ExtraAttributes?.id

         // Get stats from items
        if (group == equipment || group == armor || group == talismans ) {
         let matches = lore && lore.flatMap(line => {
         return typeof line === 'string' ? [...line.matchAll(regex)] : [];
         }) 

          matches && matches.forEach(match => {
         match != [] ? itemStats[match[2]] += Number(match[4]) : null
  
        })
   
      
    
      }}
      )
   
       
         })
        itemStats['Crit Chance'] = itemStats['Crit Chance'] + '%'
        itemStats['Crit Damage'] = itemStats['Crit Damage'] + '%'
   console.log(armorHealth,
     eqHealth
    , accHealth)
  } catch (e) {
    console.error(e)
  }
}


