'use client';
 /* eslint-disable react-hooks/exhaustive-deps */  
import React, { useEffect, useState} from 'react';
import styles from '../../../styles/body.module.scss';
import Skill from './skill';
import Image from 'next/image'
import fetch  from '../../lib/fetch.mjs'
import classNames from 'classnames'
import SearchIcon from '@mui/icons-material/Search';
import * as skinview3d from "skinview3d";


function Body() {
  const [done, setDone] = useState(false);
  const [input, setInput] = useState(""); 
  const [match, setMatch] = useState(false);
 const [data, setData] = useState({})
  
 const sbSkills = ['Combat', 'Fishing', 'Runecrafting', 'Social', 'Taiming', 'Foraging', 'Carpentry', 'Enchanting']
 const stats = {
  health: {
    color: 'red',
    icon: '❤'
  },
  defense: {
    color: 'green',
    icon: '❈'
  },
  strength: {
    color: 'red',
    icon: '❁'
  }, 
  speed: {
    color: 'white',
    icon: '✦'
  },
  crit_chance: {
  color:'blue',
  icon:'☣'
  },
  crit_damage:{
    color:'blue',
    icon:'☠'
  },
  intellgence :{
    color:"aqua",
    icon:'✎'
  },
  bonus_attack_speed: {
    color: 'yellow',
    icon: '⚔'
  },
  speed_creature_chance :{
    color: 'darkaqua',
    icon: 'α'
  },
  magic_find :{
    color: 'aqua',
    icon: '✯'
  },
  pet_luck : {
    color: 'purple',
    icon: '♣'
  },
  true_defense: {
    color: 'white',
    icon: '❂'
  },
  ferocity: {
    color: 'red',
    icon: '⫽'
  },
  ability_damage : {
    color: 'red',
    icon: '๑'
  },
  mining_speed: {
    color: 'gold',
    icon: '⸕'
  },
  mining_fortune: {
    color: 'gold',
    icon: '☘'
  },
  farming_Fortune: {
    color: 'gold',
    icon:'☘'
  },
  foraging_fortune: {
    color: 'gold',
    icon: '☘'
  },
  pristine: {
    color: 'darkPurple',
    icon: '✧'
  },
  fishing_speed: {
    color:'aqua',
    icon: '☂'
  },
  health_regen: {
    color: 'red',
    icon: '❣'
  },
  vitality : {
    color: 'darkRed',
    icon: '♨'
  },
  mending: {
    color: 'green',
    icon: '☄'
  },
  combat_wisdom: {
    color: 'darkAqua',
    icon: '☯'
  },
  farming_wisdom: {
    color: "darkAqua",
    icon: '☯'
  },
  fishing_wisdom: {
    color: 'darkAqua',
    icon: '☯'
  },
  enchanting_wisdom: {
    color: 'darkAqua',
    icon: '☯'
  }
}


  useEffect( () => {
    if (typeof window !== "undefined" && done) {
      // Initalize 3d viewer
      const canvas = document.getElementById("canvas");
      let viewer;
  
      if (canvas) {
        let url = data.account.skin;
        viewer = new skinview3d.SkinViewer({
          canvas: canvas,
          width: window.innerWidth * 0.3,
          height: window.innerHeight * 0.62,
          skin: url
        })
  
        const handleResize = () => {
          viewer.width = x.matches ? window.innerWidth * 0.2 :  window.innerWidth * 0.3,
          viewer.height = x.matches ? window.innerHeight * 0.22 :window.innerHeight * 0.62;
        };
        const wrapper = document.querySelector(`.${styles.wrapper}`)
        var x = window.matchMedia("(max-width: 114.75rem)");
        const appendCanvas = () => {
          if (x.matches) { 
             let parent = document.querySelector(`.${styles.parent}`);
              parent.insertBefore(wrapper, document.querySelector('#stat'))
              setMatch(true)
             
              wrapper.style.position = 'static'
              document.querySelector(`.${styles.flex}`).style.display = 'contents';
          } else {
            const parent = document.querySelector(`.${styles.flex}`);
              parent.insertBefore(wrapper, document.querySelector(`.${styles.display}`))
              wrapper.style.position = 'sticky'
              parent.style.display = 'flex'
              setMatch(false)
          }
        };
        appendCanvas()
        x.addEventListener('change', appendCanvas)
        window.addEventListener("resize", handleResize);
      }
    }

  }, [done]);


   
 
 
  
  // Event handling (submit, click..)
  function handleEvent(e) {
    if(e.key == 'Enter') {
      if(input.trim()) {
        handleFetch()
      }
  }}

   async function handleFetch() {
    setDone(false)
    try {
    if (input.trim()) {
     const data = await fetch(input.trim());
     setData(data)
     setDone(true)
    }
  
} catch(e) {
  console.error(e)
}}


  function handleChange(e) {
    setInput(e.target.value);
  }
   
  
  return (
    <div style = {{marginBottom: '3rem'}}>
      <div className={styles.flexContainer}>
        <div className = {styles.title}>SkyFluffy</div>
        </div>
      

      <div className={classNames({
        [styles.cell]: !done,
        [styles.celler]: done,
      })} onKeyDown={handleEvent}>
        <div id= "name">View your SB Profile</div>
        <div >
          <input id = "input"
            value={input}
            className={styles.input}
            placeholder="Enter IGN"
            onChange={handleChange}
          
          />
        </div>
     
        <div className = {styles.search}>
          <SearchIcon sx = {{'&:hover': {
            color: 'gray',
          }}}
          onClick={handleFetch} /> 
        </div>
      </div>

      <div className={done ?  styles.flex :  null}>
      <div className = {done ? styles.wrapper : null}>
     {done ? <canvas  id ='canvas'></canvas> : null}
      </div>
      <div className={classNames({
        [styles.display]: done,
        [styles.hide]: !done
      })}>
        
        {done && 
        <div className= {styles.parent}>
            <div className={styles.title}>Showing data for <div className = {styles.name}>{data.account.name}</div> on <div className={styles.name} style = {{width: 'max-content'}}> {data.profile} </div> </div>
            <div className={styles.title}>STATS <hr/></div>
             <div className = {styles.stats}>
            {/* {Object.keys(data.profiles[key].data.stats).map((statKey, index) => {
              
              //  return  <Stat key = {index} name= {statKey} stats = {stats[statKey]} vale = {data.profiles[key].data.stats[statKey]} />
              
            })
            } */}

             </div>
            <div id = 'stat' className={styles.title}>SKILLS <hr/> </div>
            

            <div  className = {styles.skill}>
             {Object.keys(data.skills).map((skill, index) => {
  return (
    <Skill  
      key={index}
      name={skill}
      level={data.skills[skill].level}
      xp={data.skills[skill].xp}
      nextXp={data.skills[skill].nextXp}
      overflow = {data.skills[skill].overflow}
    />
    
  );
})} 
</div> 
<div className = {styles.title}> INVENTORY</div>
<hr/> 
<div className={styles.inv}>
 {data.inventory.inv.map((item, index) => {
  
 return <div key = {index} className= {styles.item}> {item && <Image className = {styles.glint}width={100} height={100} src = {`/items/${item.id}.png`} alt =''/> }</div>
 })}
 </div>
</div>           
 }
 </div>
  </div>
</div>
  );
}

export default Body;

