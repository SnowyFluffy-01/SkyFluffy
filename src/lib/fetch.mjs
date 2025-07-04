import axios from "axios";
import calcXp from "./calculations/xp.mjs";
import parseInv from "./script/inventory.js";
import dotenv from "dotenv";
import parseNbt from "./utils/nbt.js";

dotenv.config({ path: ".env.local" });

const data = {
  account: {
    name: null,
    profile: null,
    skin: null,
    ranked: null,
  },
  skills: {
    farming: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    foraging: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    combat: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    social: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    fishing: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    alchemy: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    mining: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    enchanting: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    taming: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    dungeoneering: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    carpentry: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
    runecrafting: {
      xp: null,
      nextXp: null,
      level: null,
      overflow: null,
    },
  },
  inventory: {
    inv: null,
    armor: null,
    equipment: null,
    ender: null,
  },
};

export default async function fetchData(r) {
  try {
    const ignRes = await axios.get(`https://mowojang.matdoes.dev/${r}`);
    const uuid = ignRes.data.id;
    const formatteduuid =
      uuid.slice(0, 8) +
      "-" +
      uuid.slice(8, 12) +
      "-" +
      uuid.slice(12, 16) +
      "-" +
      uuid.slice(16, 20) +
      "-" +
      uuid.slice(20);
      console.log(formatteduuid)
    let skin = await axios.get("https://crafatar.com/skins/" + formatteduuid, { responseType: 'arraybuffer' });
    skin = Buffer.from(skin.data).toString('base64');
    skin = `data:image/png;base64,${skin}`
    data.account.name = ignRes.data.name;
    data.account.skin = skin;

    const now = Date.now();
    const rankRes = await axios.get(
      `https://api.hypixel.net/v2/player?uuid=${formatteduuid}`,
      {
        headers: {
          "API-Key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );
    const ranked =
      !!rankRes?.data.player?.newPackageRank ??
      rankRes.data.player.rank ??
      rankRes.data.player.prefix;
    data.account.ranked = ranked;

    const res = await axios.get(
      `https://api.hypixel.net/v2/skyblock/profiles?uuid=${formatteduuid}`,
      {
        headers: {
          "API-Key": process.env.NEXT_PUBLIC_API_KEY,
        },
      }
    );

    let id, ind;
    res.data.profiles.forEach((profile, index) => {
      if (profile.selected) {
        id = profile.profile_id;
        ind = index;
      }
    });
    const profile = res.data.profiles[ind].cute_name;
    data.account.profile = profile;

    // Fill Skills object
    const trimmed = uuid.replaceAll("-", "");
    const experience =
      res.data.profiles[ind].members[uuid].player_data.experience;
    for (const [key, value] of Object.entries(experience)) {
      const skillName = key.toLocaleLowerCase().split("_")[1];

      const { xp, level, nextXp, overflow } = calcXp(value, skillName, ranked);
      data.skills[skillName].xp = xp;
      data.skills[skillName].nextXp = nextXp;
      data.skills[skillName].level = level;
      overflow ? (data.skills[skillName].overflow = overflow) : null;
    }

    // Inventory data
    let inv =
      res.data.profiles[ind].members[uuid].inventory?.inv_contents?.data;
    let armor = res.data.profiles[ind].members[uuid].inventory?.inv_armor?.data;
    let ender =
      res.data.profiles[ind].members[uuid].inventory?.ender_chest_contents
        ?.data;
    let equipment =
      res.data.profiles[ind].members[uuid].inventory?.equipment_contents?.data;
    let talisman =
      res.data.profiles[ind].members[uuid].inventory?.bag_contents?.talisman_bag
        ?.data;
    inv = await parseNbt(inv);
    armor = await parseNbt(armor);
    ender = await parseNbt(ender);
    equipment = await parseNbt(equipment);
    talisman = await parseNbt(talisman);

    const itemData = await parseInv(inv, armor, ender, talisman, equipment);
    data.inventory.inv = itemData?.items;
    data.inventory.ender = itemData?.chest;
    data.inventory.equipment = itemData?.equipmentDisplay;
    data.inventory.armor = itemData?.armorDisplay;

    // ---------------- END

    return data;
  } catch (e) {
    if (e) console.error(e);
  }
}
