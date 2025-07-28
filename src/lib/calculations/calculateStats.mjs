import { data } from "../../../mockedRes.json" with {type: "json"}
export default function calculateStats() {
let health = 100
const milestone = data.profiles[3].members.b5d377396c0c469380749e86345d0929.bestiary.milestone
        .last_claimed_milestone;
    healthFromMilestone = Number(milestone);

    const zombieMap = {
        1: 2,
        2: 4,
        3: 7,
        4: 10,
        5: 14,
        6: 18,
        7: 23,
        8: 29,
        9: 34
    }

    const wolfMap = {
        2: 2,
        4: 4,
        6: 7,
        9: 12
    }
   const enderMap = {
        1: 1,
        3: 3,
        5: 6,
        7: 10,
        9 : 15,
    }
    const blazeMap = {
        1: 3,
        3: 7,
        5: 12,
        7: 18,
        9 : 25
    }

   const factor = level < 15 ? 2 : level < 20 ? 3 : level < 26 ? 4 : 5;
    const healthFromFarming = level * factor;
    const healthFromFishing = level * factor;
    const healthFromCata = Math.min(level * 2, 100);
    const abiphoneRelays = data.profiles[3].members.b5d377396c0c469380749e86345d0929.nether_island_player_data.abiphone.operator_chip;
    // missing relay6s and pepper and exportable carrots

     
}