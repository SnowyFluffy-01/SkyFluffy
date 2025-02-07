

export default function calculateWisdom(data, key) {
    const perks = data.profiles[key].data.perks;
    console.log("🚀 ~ calculateWisdom ~ perks :", perks )
    const currentArea = data.profiles[key].data.user_data.current_area.current_area;
    console.log("🚀 ~ calculateWisdom ~ currentArea:", currentArea)
    let combatWisdom = 0;
    
    // Combat wisdom from perks
   
    const areaPerkMapping = {
        "Crimson Isle": { perk: perks.crimson_training, wisdom: { 1: 3, 2: 5, 3: 10 } },
        "The End": { perk: perks.ender_training, wisdom: { 1: 3, 2: 5, 3: 7 } },
        "Spider's Den": { perk: perks.spider_training, wisdom: { 1: 3, 2: 5, 3: 10 } }
    };

    if (areaPerkMapping[currentArea] && currentArea.current_area_updated) {
        const { perk, wisdom } = areaPerkMapping[currentArea];
        if (perk && wisdom[perk]) {
            combatWisdom += wisdom[perk];
        }
    }
 
    // Combat wisdom from slayer
  const slayer = data.profiles[key].data.slayer.slayers
 Object.keys(slayer).forEach(key => { // Keys here is all slayer bosses 
  slayer[key]
})

 

  console.log("🚀 ~ calculateWisdom ~ combatWisdom:", combatWisdom)
  return combatWisdom;  
}

