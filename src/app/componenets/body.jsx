'use client';
 /* eslint-disable react-hooks/exhaustive-deps */  
import React, { useEffect, useState} from 'react';
import styles from '../../../styles/body.module.scss';
import Skill from './skill';
import fetch  from '../../../lib/fetch.js'
import classNames from 'classnames'
import SearchIcon from '@mui/icons-material/Search';
import calculateWisdom from '../../../lib/calculator.js'
import * as skinview3d from "skinview3d";
import calcXp from '../../../lib/xp.js'
const apiKey = process.env.API_KEY;


function Body() {
  const [done, setDone] = useState(false);
  const [input, setInput] = useState(""); 
  const [url, setUrl] = useState('') ;
  const [match, setMatch] = useState(false);
  const [data, setData] = useState({
    profile: null,
    skills: {
      farming: {
        xp: null,
        nextXp: null,
        level: null,
      }, 
      foraging: {
        xp: null,
        nextXp: null,
        level: null,
      },
      combat: {
        xp: null,
        nextXp: null,
        level: null,
      },
      social: {
        xp: null,
        nextXp: null,
        level: null,
      },
      fishing: {
        xp: null,
        nextXp: null,
        level: null,
      },
     alchemy: {
      xp: null,
      nextXp: null,
      level: null,
    },
    mining: {
      xp: null,
      nextXp: null,
      level: null,
    },
    enhanting: {
      xp: null,
      nextXp: null,
      level: null,
    },
    taming: {
      xp: null,
      nextXp: null,
      level: null,
    },
    dungeoneering: {
      xp: null,
      nextXp: null,
      level: null,
    },
    carpentry: {
      xp: null,
      nextXp: null,
      level: null,
    },
    runecrafting: {
      xp: null,
      nextXp: null,
      level: null,
    },
    }
  })
  


  
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



// Places the enter field in the header section
useEffect(() => {
  if (done) {
    const inputDiv = document.querySelector(`.${styles.celler}`);
    const headerDiv = document.querySelector(`.${styles.flexContainer}`);
    headerDiv.appendChild(inputDiv);
    const text = document.querySelector('#name');
    text.remove()
  }
}, [done]);


  //  async function fetchData (profileName) {
  
  //   try {
  //     const res = await axios.get(`https://sky.shiiyu.moe/api/v2/profile/${profileName}`);
  //     const data = res.data;
  //     // const response = await axios.get(`http://localhost:3000/api/dir?name=${encodeURIComponent(profileName)}`);
  //     // const heavyData = response.json()
  //     setData(data);
  //     console.log(data);
  //     Object.keys(data.profiles).forEach(key => {
  //       if (data.profiles[key].current) {
  //         setCurrent(true);
  //         setKey(key);
  //         setSkills(data.profiles[key].data.skills.skills);  
  //       }
  //     });
  //     setUrl(`https://mineskin.eu/skin/${profileName}`)
  //     setDone(true);
  //   } catch (e) {
  //     console.error(e);
  //     const field = document.querySelector('#input')
  //     setInput('')
  //     field.setAttribute('placeholder', 'User not found')
      
      
  //   setTimeout( () => {
  //     field.setAttribute('placeholder', 'Enter your IGN')
  //   }, 3000)
  //   } finally {
  //     setLoading(false); 
  //   }
  // };
 
  // // Calculate wisdom stats on fetch
  // useEffect( ()=> {
  //   if(data && key) {
  //     calculateWisdom(data,key)
  //   }
   
  // }, [data])

    
  useEffect( () => {
    if (typeof window !== "undefined" && done) {
  
      // Initalize 3d viewer
      const canvas = document.getElementById("canvas");
      let viewer;
  
      if (canvas) {
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
        let wrapper = document.querySelector(`.${styles.wrapper}`)
        var x = window.matchMedia("(max-width: 114.75rem)");
        const appendCanvas = () => {
          if (x.matches) { 
             let parent = document.querySelector(`.${styles.parent}`);
              parent.insertBefore(wrapper, document.querySelector('#stat'))
              setMatch(true)
             
              wrapper.style.position = 'static'
              document.querySelector(`.${styles.flex}`).style.display = 'contents';
          } else {
            
            let parent = document.querySelector(`.${styles.flex}`);
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

  }, [done,url]);


   
 
 
  
  // Event handling (submit, click..)
  function handleEvent(e) {
    if(e.key == 'Enter') {
      if(input.trim()) {
        handleFetch(input.trim())
      }
  }}

   async function handleFetch(e) {
    setDone(false)
    try {
    if (input.trim()) {
     const {profile, name} = await fetch(input.trim());
     setProfile({profile, name})
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
            <div className={styles.title}>Showing data for <div className = {styles.name}>{profile.name}</div> on <div className={styles.name} style = {{width: 'max-content'}}> {profile.profile} </div> </div>
            <div className={styles.title}>STATS <hr/></div>
             <div className = {styles.stats}>
            {/* {Object.keys(data.profiles[key].data.stats).map((statKey, index) => {
              
              //  return  <Stat key = {index} name= {statKey} stats = {stats[statKey]} vale = {data.profiles[key].data.stats[statKey]} />
              
            })
            } */}

             </div>
            <div id = 'stat' className={styles.title}>SKILLS <hr/> </div>
            

            <div  className = {styles.skill}>
            {/* {Object.keys(skills).map((skillKey, index) => {
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
})} */}
</div> 
<div className = {styles.title}> INVENTORY</div>
<hr/> 
<div className = {styles.inv}>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className = {styles.spacer}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}></div>
   <div className={styles.item}>  </div> 
     
   </div>  
</div>           
 }
 </div>
  </div>
</div>
  );
}

export default Body;

