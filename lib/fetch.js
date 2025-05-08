
import axios from "axios"
import calcXp from './xp.js'
import next from "next";

export default async function fetchData(r) {
  let data = {
    profile: null,
    skills: {
      farming: {
        xp: null,
        nextXp: null,
        level: null,
      }, 
      foraging: {
        xp: null,
        nextXp: null,
        level: null,
      },
      combat: {
        xp: null,
        nextXp: null,
        level: null,
      },
      social: {
        xp: null,
        nextXp: null,
        level: null,
      },
      fishing: {
        xp: null,
        nextXp: null,
        level: null,
      },
     alchemy: {
      xp: null,
      nextXp: null,
      level: null,
    },
    mining: {
      xp: null,
      nextXp: null,
      level: null,
    },
    enhanting: {
      xp: null,
      nextXp: null,
      level: null,
    },
    taming: {
      xp: null,
      nextXp: null,
      level: null,
    },
    dungeoneering: {
      xp: null,
      nextXp: null,
      level: null,
    },
    carpentry: {
      xp: null,
      nextXp: null,
      level: null,
    },
    runecrafting: {
      xp: null,
      nextXp: null,
      level: null,
    },
    }
  }

  try {
  
  const n = await axios.get(`https://api.ashcon.app/mojang/v2/user/${r}`);
  const uuid = n.data.uuid;
  const re = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
    headers: {
    'API-Key':process.env.NEXT_PUBLIC_API_KEY
    }
  });
 const res = re.data;
 let id, ind;
 res.profiles.forEach((profile,index) => {
  if (profile.selected) {
   id  = profile.profile_id
   ind = index;
  } 
 })
 let profile = res.profiles[ind].cute_name
 let name = n.data.username;
data.name= name;
data.profile = profile;

// Convert xp to levelws;

for(const [key, value]of Object.entries(res.profiles[ind].experience)) {
let skillName = key.toLocaleLowerCase().split('_')[1]
const {level, nextXp} = calcXp(value)
data.skills[skillName].xp = value
data.skills[skillName].nextXp = nextXp;
data.skills[skillName].level = level;
}

} catch(e) {
e? console.error(e) : null;
}}

