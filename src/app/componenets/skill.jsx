import react from 'react';
import styles from '../../../styles/skill.module.scss'
import Image from 'next/image'
function Skill({src, name, level, maxLevel, currentXp, nextXp}) {
  // console.log("🚀 ~ Skill ~ src, name, width, maxLevel, currentXp, nextXp:", src, name, level, maxLevel, currentXp, nextXp)
 
  let barWidth;
  
  if(nextXp) {
    barWidth =  Math.floor((currentXp/nextXp) * 100)
  } else {
    barWidth = 100
  }
    const namer = name.slice(0,1).toUpperCase() + name.slice(1)
    
     let xp;
     if(nextXp && nextXp > 1000000) {
       xp = (currentXp / 1000000).toFixed(1) + 'm /'+ (nextXp/1000000).toFixed(1) + 'm XP'
      
     } else if (nextXp && nextXp > 1000 && currentXp > 1000){
      xp = (currentXp / 1000).toFixed(1) + 'k /' + (nextXp/1000).toFixed(1) + 'k XP'

     } else if(!nextXp)
      {
        if(currentXp > 1000 && currentXp < 1000000) {
        xp = (currentXp / 1000).toFixed(1) + 'k OVERFLOW'
        } else {
         xp = (currentXp / 1000000).toFixed(1) + 'm OVERFLOW'
      }}
     else {
      xp = currentXp +'/'+ nextXp +' XP'
     }  

     
    function isMax() {
     if(barWidth > 99) {
      return true
     } else {
      return false
     }
    }
   const source = `/skills/${src}.png`

    return (
    
      <div className = {styles.container}>
        <div className={styles.image} style = {{ backgroundColor: isMax() ? 'gold' : 'green' }}>
<Image  width= {50} height = {50}alt = ''  src= {source} />  
        </div>
<div className={styles.name}> {namer + ' ' + level} </div>

<div className = {styles.barContainer}>

    <div className = {styles.bar} style= {{width: `${barWidth}%`, backgroundColor: isMax() ? 'gold' : 'green'}}> 
   
    </div>
    <div style = {{marginLeft: '16%'}} className = {styles.xp}> {xp} </div>
  
     
</div>   
     
</div>


)}

export default Skill;