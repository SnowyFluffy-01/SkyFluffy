import axios from 'axios';
import nbt from 'prismarine-nbt'


export default async function fetchData(name) {
  const APIKey = process.env.API_KEY;

  try {
    // Fetch user data
    const n = await axios.get(`https://api.ashcon.app/mojang/v2/user/${name}`);
    const uuid = n.data.uuid;

    // Fetch Skyblock profiles
    const res = await axios.get(`https://api.hypixel.net/v2/skyblock/profiles?uuid=${uuid}`, {
      headers: {
        'API-Key': APIKey
      }
    });
  
    // Data handling
    let key = Object.keys(res.data.profiles[0].members);
    let inv = res.data.profiles[0].members[key[2]].inventory.inv_contents.data;
     conesole.log(res.data.profiles)
    let buf = Buffer.from(inv, 'base64');

    // Return a Promise from the nbt.parse function
    return new Promise((resolve, reject) => {
      nbt.parse(buf, (err, dat) => {
        if (err) return reject(err); // Reject the promise on error

        let simplifiedData = nbt.simplify(dat);
        simplifiedData.i.forEach((item, index) => {
         
        })
        // Resolve the promise with the desired data
        resolve(simplifiedData);
      });
    });
  } catch (error) {
    throw error;
  }
}


