import { readFile } from "fs/promises";
import path from "path";


const dirPath = path.resolve(
  "public",
  "textures",
  "assets",
  "firmskyblock",
  "models",
  "item"
);

export default async function getPathFromJSON(item) {
  try {
    if (!item) return;
    const id = item?.tag?.ExtraAttributes?.id;
    if (!id) return;
    const data = await readFile(path.join(dirPath, `${id}.json`), "utf-8");
    const obj = JSON.parse(data); 
    let itemPath;

    function checkPredicate(obj, returnInverseBool = false) {
      for (const [key, value] of Object.entries(obj.predicate || obj)) {
        switch (key) {
          case "firmament:all": {
            const pass = value.every(cond => checkPredicate(cond, false))
            itemPath = pass && obj.model;
            return returnInverseBool ? !pass : pass;
        }
         case "firmament:lore": {
          const regex = value.regex && new RegExp(value.regex);
          const index = item.tag.display.Lore.findIndex((line) =>
            regex ? regex.test(line) : line.includes(value)
          );
          const pass = index !== -1
   itemPath = pass && obj.model;
         return returnInverseBool ? !pass : pass
              
        }
        case "firmament:extra_attributes": {
          const str = item.tag.ExtraAttributes[value.path];
          let matchStr = value.string;
          const regex = matchStr?.regex && new RegExp(matchStr.regex);
            const pass = regex ? regex.test(str) : str == matchStr; 
            return returnInverseBool ? !pass : pass;
        
        }
        case "firmament:display_name": {
          const regex = new RegExp(value);
            const pass = regex.test(item.tag.display.Name);
               itemPath = pass && obj.model;
             return returnInverseBool ? !pass : pass;
          }
            
          case "firmament:not": {
            const pass = checkPredicate(obj.predicate["firmament:not"], true)

             return returnInverseBool ? !pass : pass;
        }
          default:
            
            return false;
      }
      }
    }
   
    if (obj?.overrides) {
      for (let i = obj.overrides.length - 1; i >= 0; i--)  {
        const predicate = obj.overrides[i]
        const pass = checkPredicate(predicate, false) 
        if (pass) {
          itemPath = predicate.model
          break
        }
      }
      
    }
if (!itemPath) {
  itemPath = obj?.textures?.layer0 || obj.parent +"_front "
}

    if (itemPath) {
      itemPath = itemPath.split("/").pop();
    }
   

   

    const pathOut = itemPath;
    return pathOut;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
