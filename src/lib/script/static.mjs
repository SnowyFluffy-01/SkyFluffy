import fs from 'graceful-fs'
import animateTexture from './animated.mjs'
import path from 'path'
import { promisify } from 'util'
import sharp from 'sharp'
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)
const dirPath = path.resolve('public','textures','assets','minecraft','mcpatcher','cit');

async function moveStaticPicture(inputDir, outputDir) {
               await sharp(inputDir).median(1).linear(1.05)
                 .resize({
                 width: 100,
                 height: 100,
                 fit: 'fill',  
                 kernel:sharp.kernel.nearest,               
                 background: { r: 0, g: 0, b: 0, alpha: 0 }, 
                 withoutEnlargement: false,   
                 fastShrinkOnLoad: false      
                }).sharpen({
                  sigma: 1.5,
                  flat: 1.0,
                  jagged: 1.0
                }).normalise().toFormat('png', {
                  compressionLevel: 9,         
                  quality: 100,          
                  palette: true,         
                  colors: 256              
                }).toFile(outputDir);
              }
            
 export async function unifyTextureDir(currentDirPath) {
    try {
      let propertyCheck = true;
      const files = await readdir(currentDirPath)
      for (const file of files) {
        const fullPath = path.join(currentDirPath, file)
        const stats = await stat(fullPath)
        if (stats.isDirectory()) {
          if(file == 'models' || file =='ui') {
            continue;
          }
        
         await unifyTextureDir(fullPath) 
        } else if (stats.isFile()) {
         const id = file.split('.')[0].toLowerCase()
         let frameTime;
         let copy = false;
          if (path.extname(file) == `.png`) {
            if (files.includes(`${id}.png.mcmeta`)) {
              //This means its animated
             let data = await readFile(path.join(currentDirPath,`${id}.png.mcmeta`), 'utf8') // id guranteed to work 
             frameTime = JSON.parse(data)
             const stats = {frameTime, id, path: fullPath}
             await animateTexture(stats) // works perfectly
             continue;
            }
            // png not animated
              if(path.basename(currentDirPath) == 'items') {
                // items dont have properties, move them right away
                await moveStaticPicture(fullPath, path.resolve('public','items',`${id}.png`))
                continue;
              }
              if(!files.includes(`${id}.properties`)) {
                continue
                // not in items no properties useless poof
              }
             const properties = await readFile(path.join(currentDirPath, `${id}.properties`), 'utf8')
             const reg = /nbt\.ExtraAttributes\.id=(?:regex:)?(?:\(\?:)?([^_]+_)?(?:\)\?)?([^\(]+)(?:\()(\d*)/gm
             const matches = [...properties.matchAll(reg)]
             if(matches.length === 0) {
              continue; //no match ? not likelyt but 
             }
             const newFileName = matches.map(match => {
              if(match[1]) {
                copy = true;
                return match[1] + match[2]
                
              } else if (match[3]) {
                return match[2] + match[3]
              } else {
                return match[2]
              }
            } 
             )
             if (copy) {
              const copyPath = path.resolve('public','items', newFileName[0].toLowerCase() + '.png')
            await moveStaticPicture(fullPath, copyPath)
            continue
             }
       
             const texturePath = path.resolve('public','items', `${id}.png`) 
              await moveStaticPicture(fullPath, texturePath)
            }
             
          
        
      
   }} } catch (err) {
      console.log( err)
    
    }
  }


