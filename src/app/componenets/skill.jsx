import react from 'react';
import styles from '../../../styles/skill.module.scss'
import Image from 'next/image'
function Skill({name, level, overflow , xp, nextXp}) {

 
  let barWidth;
  if(nextXp) {
    barWidth =  Math.floor((xp/nextXp) * 100)
  } else {
    barWidth = 100
  }

  const namer = name.slice(0,1).toUpperCase() + name.slice(1)
    
    
  function isMax() {
     if(barWidth > 99) {
      return true
     } else {
      return false
     }
    }

    xp = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(xp);
  
  overflow? overflow = new Intl.NumberFormat('en-US', {
    notation: "compact",
    compactDisplay: "short",
   minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(overflow) : null;
   const source = `/skills/${name}.png`

    return (
    
      <div className = {styles.container}>
        <div className={styles.image} style = {{ backgroundColor: isMax() ? 'gold' : 'green' }}>
<Image  width= {50} height = {50}alt = ''  src= {source} />  
        </div>
<div className={styles.name}> {namer + ' ' + level} </div>

<div className = {styles.barContainer}>
    <div className = {styles.bar} style= {{width: `${barWidth}%`, backgroundColor: isMax() ? 'gold' : 'green'}}> 
    </div>
    <div style = {{marginLeft: '16%'}} className = {styles.xp}> {overflow ? overflow + " OVERFLOW": xp} </div>
  
</div>   
</div>


)}

export default Skill;