'use client';
import React, { useEffect, useState, useCallback } from 'react';
import styles from './body.module.scss';
import axios from 'axios';
import Skill from './skill';
import classNames from 'classnames';
import Stat from './stat';
import ReactSkinview3d from "react-skinview3d";
import SearchIcon from '@mui/icons-material/Search';
import { SettingsRemoteOutlined } from '@mui/icons-material';
import calculateWisdom from './calculator.js'
const apiKey = process.env.API_KEY;

function Body() {
  
  const [done, setDone] = useState(false);
  const [data, setData] = useState(null);
  const [current, setCurrent] = useState(false);
  const [key, setKey] = useState(null);
  const [input, setInput] = useState("");
  const [skills, setSkills] = useState({});
  const [loading, setLoading] = useState(false);  
  const [url, setUrl] = useState('') ;
  const [match, setMatch] = useState(false);
  const [fontSize,  setFontSize] = useState()
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


useEffect(() => {
  if (done) {
    const inputDiv = document.querySelector(`.${styles.celler}`);
    const headerDiv = document.querySelector(`.${styles.flexContainer}`);
    headerDiv.appendChild(inputDiv);
    const text = document.querySelector('#name');
    text.remove()
  }
}, [done]);




if(typeof window !== "undefined"  && done ) {
  const x = window.matchMedia("(min-width: 130rem)");
  x.addEventListener("change", ()=> {
    const display = document.querySelector(`.${styles.display}`)
    const skin = document.querySelector(`.${styles.wrapper}`)
    const html = document.getElementsByTagName("html")[0]
    if(x.matches) {
    setMatch(true);
  
  }
   else {
    setMatch(false);
   }
  }
)
}
   async function fetchData (profileName) {
    setLoading(true);
    try {
      const res = await axios.get(`https://sky.shiiyu.moe/api/v2/profile/${profileName}`);
      const data = res.data;
      setData(data);
      console.log(data);
      Object.keys(data.profiles).forEach(key => {
        if (data.profiles[key].current) {
          setCurrent(true);
          setKey(key);
          setSkills(data.profiles[key].data.skills.skills);  
        }
      });
      setUrl(`https://mineskin.eu/skin/${profileName}`)
      setDone(true);
    } catch (e) {
      console.error(e);
      const field = document.querySelector('#input')
      setInput('')
      field.setAttribute('placeholder', 'User not found')
      
      
    setTimeout( () => {
      field.setAttribute('placeholder', 'Enter your IGN')
    }, 3000)
    } finally {
      setLoading(false); 
    }
  };
 
  useEffect( ()=> {
    if(data && key) {
      calculateWisdom(data,key)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  
  // Handlers
  function handleEvent(e) {
    if(e.key == 'Enter') {
      if(input.trim()) {
        fetchData(input.trim());
      }
  }}

  function handleSubmit(e) {
    if (input.trim()) {
      fetchData(input.trim());
    }
  }

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
          }}}onClick={handleSubmit} /> 
        </div>
      </div>

      <div className={done ? styles.flex : null}>
      <div className = {styles.wrapper}>
     {done ? match ? <ReactSkinview3d
     skinUrl = {url}
     width = "100%"
     height= "100%"
     /> : null : null}
      </div>
      <div className={classNames({
        [styles.display]: done,
        [styles.hide]: !done
      })}>
        
        {done && 
        <div className= {styles.parent}>
            <div className={styles.title}>Showing data for <div className = {styles.name}>{data && data.profiles[key].data.display_name}</div> on <div className={styles.name} style = {{width: 'max-content'}}> {data?.profiles[key]?.cute_name}</div> </div>
            <div className={styles.title}>STATS <hr/></div>
             <div className = {styles.stats}>
            {Object.keys(data.profiles[key].data.stats).map((statKey, index) => {
              const stat =data.profiles[key].data.stats[statKey]
              
                // <Stat name= {stat} icon = {stats[key].icon} value = {stat.value}/>
              
            })
            }

             </div>
            <div className={styles.title}>SKILLS <hr/> </div>
            

            <div  className = {styles.skill}>
            {Object.keys(skills).map((skillKey, index) => {
  const skill = skills[skillKey];
  return (
    <Skill  
      key={index}
      name={skillKey}
      src = {skillKey}
      level={skill.level}
      maxLevel={skill.maxLevel}
      currentXp={skill.xpCurrent}
      nextXp={skill.xpForNext}
    />
    
  );
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

