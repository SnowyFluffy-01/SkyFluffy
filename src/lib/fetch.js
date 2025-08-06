"use server";
import axios from "axios";
import calcXp from "./calculations/calculateXp.js";
import parseInv from "./parsers/parseInv.js";
import { redis } from "./redis.js";
import parsePets from "./parsers/parsePets.js";

// const sbSkills = [
//   "Combat",
//   "Fishing",
//   "Runecrafting",
//   "Social",
//   "Taiming",
//   "Foraging",
//   "Carpentry",
//   "Enchanting",
// ];
// const stats = {
//   health: {
//     color: "red",
//     icon: "❤",
//   },
//   defense: {
//     color: "green",
//     icon: "❈",
//   },
//   strength: {
//     color: "red",
//     icon: "❁",
//   },
//   speed: {
//     color: "white",
//     icon: "✦",
//   },
//   crit_chance: {
//     color: "blue",
//     icon: "☣",
//   },
//   crit_damage: {
//     color: "blue",
//     icon: "☠",
//   },
//   intellgence: {
//     color: "aqua",
//     icon: "✎",
//   },
//   bonus_attack_speed: {
//     color: "yellow",
//     icon: "⚔",
//   },
//   speed_creature_chance: {
//     color: "darkaqua",
//     icon: "α",
//   },
//   magic_find: {
//     color: "aqua",
//     icon: "✯",
//   },
//   pet_luck: {
//     color: "purple",
//     icon: "♣",
//   },
//   true_defense: {
//     color: "white",
//     icon: "❂",
//   },
//   ferocity: {
//     color: "red",
//     icon: "⫽",
//   },
//   ability_damage: {
//     color: "red",
//     icon: "๑",
//   },
//   mining_speed: {
//     color: "gold",
//     icon: "⸕",
//   },
//   mining_fortune: {
//     color: "gold",
//     icon: "☘",
//   },
//   farming_Fortune: {
//     color: "gold",
//     icon: "☘",
//   },
//   foraging_fortune: {
//     color: "gold",
//     icon: "☘",
//   },
//   pristine: {
//     color: "darkPurple",
//     icon: "✧",
//   },
//   fishing_speed: {
//     color: "aqua",
//     icon: "☂",
//   },
//   health_regen: {
//     color: "red",
//     icon: "❣",
//   },
//   vitality: {
//     color: "darkRed",
//     icon: "♨",
//   },
//   mending: {
//     color: "green",
//     icon: "☄",
//   },
//   combat_wisdom: {
//     color: "darkAqua",
//     icon: "☯",
//   },
//   farming_wisdom: {
//     color: "darkAqua",
//     icon: "☯",
//   },
//   fishing_wisdom: {
//     color: "darkAqua",
//     icon: "☯",
//   },
//   enchanting_wisdom: {
//     color: "darkAqua",
//     icon: "☯",
//   },
// };

export default async function fetchData(r) {
  try {
    const data = {}
    const ignRes = await axios.get(`https://mowojang.matdoes.dev/${r}`);
    const uuid = ignRes.data.id;
    const exists = (await redis.exists(uuid)) == 1;
    const cache = exists ? await redis.get(uuid) : null;
    if (cache) return cache;
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
    console.log(formatteduuid);

    const [rankRes, skinRes, res] = await Promise.all([
      axios.get(`https://api.hypixel.net/v2/player?uuid=${formatteduuid}`, {
        headers: {
          "API-Key": process.env.API_KEY,
        },
      }),

      axios.get("https://crafatar.com/skins/" + formatteduuid, {
        responseType: "arraybuffer",
      }),

      axios.get(
        `https://api.hypixel.net/v2/skyblock/profiles?uuid=${formatteduuid}`,
        {
          headers: {
            "API-Key": process.env.API_KEY,
          },
        }
      ),
    ]);



    let skin = Buffer.from(skinRes.data).toString("base64");
    skin = `data:image/png;base64,${skin}`;
    data.account = data.account || {}
    data.account.name = ignRes.data.name;
    data.account.skin = skin;

    const ranked =
      !!rankRes?.data.player?.newPackageRank ??
      rankRes.data.player.rank ??
      rankRes.data.player.prefix;
    data.account.ranked = ranked;

    const ind = res.data.profiles.findIndex((profile) => profile.selected);
    const profile = res.data.profiles[ind].cute_name;
    data.account.profile = profile;

    // Fill Skills object
    const experience =
      res.data.profiles[ind].members[uuid].player_data.experience;
    for (const [key, value] of Object.entries(experience)) {
      const skillName = key.toLocaleLowerCase().split("_")[1];
      data.skills = data.skills || {}
      const { xp, level, nextXp, overflow } = calcXp(value, skillName, ranked);
      data.skills[skillName] = data.skills[skillName] || {}
      data.skills[skillName].xp = xp;
      data.skills[skillName].nextXp = nextXp;
      data.skills[skillName].level = level;
      data.skills[skillName].overflow = overflow;
    }
    const cataXP = Number(
      res.data?.profiles[ind]?.members[uuid]?.dungeons?.dungeon_types?.catacombs
        ?.experience
    );
    const { xp, level, nextXp, overflow } = calcXp(
      cataXP,
      "dungeoneering",
      ranked
    );
    data.skills.dungeoneering = data.skills.dungeoneering || {}
    data.skills.dungeoneering.xp = xp;
    data.skills.dungeoneering.nextXp = nextXp;
    data.skills.dungeoneering.level = level;
    data.skills.dungeoneering.overflow = overflow;

    
    // Inventory data
    data.inventory = data.inventory || {}
    const inventoryPath = res.data?.profiles[ind]?.members[uuid]?.inventory;
    let inv = inventoryPath.inv_contents?.data;
    let armor = inventoryPath.inv_armor?.data;
    let ender = inventoryPath.ender_chest_contents?.data;
    let equipment = inventoryPath.equipment_contents?.data;
    let talisman = inventoryPath.bag_contents?.talisman_bag?.data;
    let pets = res.data.profiles[ind].members[uuid].pets_data.pets;

    [inv, armor, ender, equipment, talisman, pets] = await Promise.all([
      parseInv(inv, "inventory"),
      parseInv(armor, "armor"),
      parseInv(ender, "ender"),
      parseInv(equipment, "equipment"),
      parseInv(talisman, "talisman"),
      parsePets(pets),
    ]);

    data.inventory.inv = inv;
    data.inventory.talisman = talisman;
    data.inventory.ender = ender;
    data.inventory.equipment = equipment;
    data.inventory.armor = armor;
    data.inventory.pets = pets;
    // ---------------- END

    redis.set(uuid, data, { ex: 10 });
    return data;
  } catch (e) {
    console.error(e);
  }
}
