import { fallbackModeToFallbackField } from "next/dist/lib/fallback";
import { data } from "../../../mockedRes.json" with {type: "json"}
export default function calculateStats(_data, res, index, uuid) {
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
        // 5:1, 7:2 for CD
        6: 7,
        9: 12
    }

    const spiderMap = {
        7: 1
    }
   const enderMap = {
        1: 1,
        3: 3,
        5: 6,
        7: 10,
        9 : 15,
    }
    const blazeMap = {
        health: {
            1: 3,
            3: 7,
            5: 12,
            7: 18,
            9: 25
        },
        strength: {
            2: 1,
            6: 2
        }
    }

    const profile = data.profiles[index].members.uuid
    const bestiary = profile.bestiary 

    const healthFactor = level < 15 ? 2 : level < 20 ? 3 : level < 26 ? 4 : 5;
    const farmingLevel = data.skills.farming.level
    const healthFromFarming = farmingLevel * healthFactor;
    const healthFromFishing = data.skills.fishing.Level * healthFactor;
    const healthFromCata = Math.min(data.skills.dungeoneering.level * 2, 100);
    const abiphoneRelays = profile.nether_island_player_data.abiphone.operator_chip;
    const healthFromEssence = profile.player_data.perks.permanent_health;
    const healthFromPepper = profile.player_data.reaper_peppers_eaten;
    const healthFromRelay = profile.nether_island_player_data.abiphone.operator_chip.repaired_index * 2
    const healthFromCarrots = profile.rift.village_plaza.cowboy.exported_carrots == 3000 && 5;
    
    let petAbilityHealth = "currently blue whale, ender dragon, blaze, elephant, mithril golem"

    // -------- DEFENSE
    const defenseFactor = data.skills.mining.level < 15 ? 1 : 2;
    const defenseFromMining = data.skills.mining.level * defenseFactor; 
    const defenseFromEssence = profile.player_data.perks.permanent_defense;
    const defenseFromAmmonite = 2 * (data.skills.fishing.level + data.skills.mining.level);
    const petsThatGiveDefense = "baby yeti 75% of strength, blue whale: health/ 20, 30% from turtle + global buffers from pets"
     

    // ---- STRENGTH
    const strenghtFactor = data.skills.foraging.level < 15 ? 1 : 2;
    const strengthFromForaging = data.skills.foraging.level * strenghtFactor;
    const strenghtFromEssence = profile.player_data.perks.catacombs_strength;
    const strengthFromSBLevel = data.skyblockLevel / 5;
    const petSource = "giraffe, gdrag, griffin, maybe lion, ";

    // ---INTELLIGENCE

    const AlcFactor = strenghtFactor;
    const intelFromAlc = data.skills.alchemy.level * AlcFactor;
    // const intelFromFDefuse = traps / 5;

    // same thing for enchanting
    const intelFromEnchanting = data.skills.enchanting.level * AlcFactor
    const intelEssence = profile.player_data.perks.permanent_intelligence;
    // idk about the harp

    // ----CC
    const ccfromcombt = data.skills.combat.level / 2;
    
    // CD
    const cd = slayerLevel < 5 ? 1 : level < 7 ? 2 : level == 7 ? 0 : 3;
    // giraffe pet

    // attack speed is just temporary parsing

    // ability damage
    const ability_damage = data.skills.enchanting.level / 2;

    // true defense 
    checkWisp();
    // 4:1 , 8: 2

    // --- fero 
    //tiger
    
    
    // --health regen
    // 8: 50 zombie
    // giraffe pet
    
    //-- vitality
    // unbreaking perk
    
    // - mending and swing range basically lore parse
    
    
    // --------- GATHERIN GSTATS ------------
    
// mining speed
// eager perk in mining islands

//silverfish pet


// mining fortune

// 4 per mining level
    const mif = data.skills.mining.level * 4
    
// check wiki because so many operks
    // glacvite tungstenn umber, 6,7,8 | 5,7,8 | 7,8
    const collections = profile.player_data.unlocked_coll_tiers;
    
    // cocoa truffle
    const truffle = profile.events.easter.refined_dark_cacao_truffles;
    // dwarven o's NOT INCLUDED
    
 //galcite golem TO EPTS
 // kuudra  PET TI PETS
 // snail TO PETS
 
 // miing spread
 // nothing really
 
 // gemstone spread
 // hotm only
 
 // pristine
 // lore 
 
 
 // ff
 //a lot
 // 4 per level of famring
  const faf = data.skills.farming.level * 4
    
    // garden farming fortune
    
 // crop upgrades *
 // plots *
 //extra ff
 // PB ?
 //pest bestiary
 // carrots
 // expired pumopkin
 // fine flour and supreme choco bar
 // truffle
 // chcoo fortune
 // mushroom cow
 // 
 
 // FORAGHING CFORTUNE
 // 4 per level
 
 // breaking power
 // idk tools + hotm
 
 // widom
 // alchemy: spider 8 --> 10
 
 // caprentry: nothing LMAO
 
 // 3 combat: 3perks : crimson training: 3,5,10 | ender training: 3,5,7 | spider training: 3,5,10
 // slayer: t1, t2,t3: 1 / t4: t5: 2 per type
    
// enchanting: lore

// farming: fruit bowl; ? 
// fishing: moby duck ??

// mining
//  dwarvin training: 3,5,10
// silverfish

//runcrafting nothing really
// social same thing

// taming: owl pet


    AHAHAHAHAHAH
    // fishing
    // fishing speed: ammonite pet : mining / fishing level 0.5 per
    // maybe dolphin
    // flying fish
    // reindeer 
    
    // hunter armor: 0.2 / 0.4 / 0.7 / 1per star on armor
    // maybe bobbin time
    

    // sea creature chance
    // winter rod is worth noting
    // ammonite 1 per hotm level
    // dolphin
    // reindeer 
    // superiopr ??!?!
    
    // double hook chance
    // nothing but lkore
    
    //  torphy fish chance
    // full armor bonus of hunter armor
    
    // trewasure chance
    // 0.1 per level fishing
    // hermit crab 
    // some backwater abyou stuffsies
    
    
    
    // MISC
    
    // fear: eerie pet 
    
    // heat res: hotm keep it cool  / 
    // cold res: pepper / frozen skin perk: 2,4,6,8,10
    
    // bonus pest chance: wriggling lava slug perty
    
    // pet luck: 1 per taming level
    
    // magic find: account upgrade 1 per/ necrons ladder ? 
    // gdrag 2.2 per gold collectiojn digit
    // mithril golem
    

    // speed: forbidden speed perk / wolf slayer 1,3,8
    // cap 400
    // increases cap: blkakc cat / cactus knife / racing helmet / young dragon
         
    
    
    // ammonite / armadollo / monkey // farem suit armor// young drag //  pelt belt 
    
    
    // rift 
    // too lazy rip

}