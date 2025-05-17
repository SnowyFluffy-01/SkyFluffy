import axios from 'axios'
import calcXp from './xp.mjs'
import parseInv from './inventory.js';
import dotenv from 'dotenv'
dotenv.config({path: ".env.local"})

export default async function fetchData(r) {
  let data = {
    account: {
    name: null,
    profile: null,
    skin: null,
    ranked: null
    },
    skills: {
      farming: {
        xp: null,
        nextXp: null,
        level: null,
         overflow: null
      }, 
      foraging: {
        xp: null,
        nextXp: null,
        level: null,
         overflow: null
      },
      combat: {
        xp: null,
        nextXp: null,
        level: null,
         overflow: null
      },
      social: {
        xp: null,
        nextXp: null,
        level: null,
         overflow: null
      },
      fishing: {
        xp: null,
        nextXp: null,
        level: null,
         overflow: null
      },
     alchemy: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null
    },
    mining: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    enchanting: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    taming: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    dungeoneering: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    carpentry: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    runecrafting: {
      xp: null,
      nextXp: null,
      level: null,
       overflow: null
    },
    },

  }
  

  
  try {
//#region Fill account object:
  const ignRes =  await axios.get(`https://api.ashcon.app/mojang/v2/user/${r}`)
 const uuid = ignRes.data.uuid;
  data.account.name = ignRes.data.username
 data.account.skin = ignRes.data.textures.skin.url

//#endregion
  const rankRes =  await axios.get(`https://api.hypixel.net/v2/player?uuid=${uuid}`, {
    headers: {
        'API-Key' : process.env.NEXT_PUBLIC_API_KEY
    }
})
let ranked = !!rankRes?.data.player?.newPackageRank ?? rankRes.data.player.rank ?? rankRes.data.player.prefix
data.account.ranked = ranked


  const res = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
    headers: {
    'API-Key': process.env.NEXT_PUBLIC_API_KEY
    }
  })
 
  
 let id, ind;
 res.data.profiles.forEach((profile,index) => {
  if (profile.selected) {
   id  = profile.profile_id
   ind = index;
  } 
 })
 let profile = res.data.profiles[ind].cute_name 
data.account.profile = profile;

// Fill Skills object 
let trimmed = uuid.replaceAll('-', "")
for(const [key, value]of Object.entries(res.data.profiles[ind].members[trimmed].player_data.experience)) {
let skillName = key.toLocaleLowerCase().split('_')[1]
console.log(skillName)
const {xp, level, nextXp, overflow} = calcXp(value, skillName,ranked)
console.log("reached: " + level, nextXp, overflow)
data.skills[skillName].xp = xp;
data.skills[skillName].nextXp = nextXp;
data.skills[skillName].level = level;
overflow ? data.skills[skillName].overflow = overflow : null;
}
console.log ('here' + ranked)

// Inventory data 
let inv = res.data.profiles[ind].members[trimmed].inventory?.inv_contents?.data 
inv && parseInv(inv)



// ---------------- END 
 return data 
} catch(e) {
  if(e) console.error(e)
}}

fetchData("fazfoxy")

