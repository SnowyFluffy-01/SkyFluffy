"use client";
import React, { useEffect, useState, useRef, useContext } from "react";
import styles from "../../../styles/page.module.css";
import Skill from "./skill";
import fetch from "../../lib/fetch.js";
import { SkinViewer } from "skinview3d";
import Cell from "./cell";
import Inventory from "./inventory";
import Pets from "./pets";
import { useTooltip } from "./context";
export default function Page() {
  const [status, setStatus] = useState("idle");
  const [input, setInput] = useState("");
  const [match, setMatch] = useState(false);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("inventory");
  const canvasRef = useRef(null);
  const appendRef = useRef(null);
  const originalRef = useRef(null);
  const viewerRef = useRef(null);

  const { eventRef, setShowCentered, showCentered, deactivatedRef} = useTooltip()
  useEffect(() => {
    const handleClick = (e) => {
      const lore = document.getElementById("lore")
      if (!eventRef.current || e.currentTarget == lore) return;
     
        setShowCentered(false)
       deactivatedRef.current = false;
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    if (!viewerRef.current) {
      viewerRef.current = new SkinViewer({
        canvas: canvasRef.current,
        width: window.innerWidth * 0.3,
        height: window.innerHeight * 0.62,
        skin: data?.account?.skin,
      });
    } else {
      viewerRef.current.loadSkin(data?.account?.skin);
    }

    const mediaQuery = window.matchMedia("(max-width: 80rem)");
    const handleResize = () => {
      viewerRef.current.width = mediaQuery.matches
        ? window.innerWidth * 0.2
        : window.innerWidth * 0.3;
      viewerRef.current.height = mediaQuery.matches
        ? window.innerHeight * 0.22
        : window.innerHeight * 0.62;
    };

    setMatch(mediaQuery.matches);

    mediaQuery.addEventListener("change", () => setMatch(mediaQuery.matches));
    window.addEventListener("resize", handleResize);
  }, [data?.account?.skin]);

  useEffect(() => {
    // match means append!
    if (!canvasRef.current) return;
    if (match) {
      appendRef.current.insertBefore(
        canvasRef.current,
        appendRef.current.children[0] || null
      );
    } else {
      originalRef.current.appendChild(canvasRef.current);
    }
  }, [match]);

  const handleEvent = (e) => {
    if (e.key == "Enter") {
      if (input.trim()) {
        handleFetch();
      }
    }
  };

  const handleFetch = async () => {
    try {
      setStatus("loading");
      const data = await fetch(input.trim());
      setData(data);
      setStatus("done");
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div id="root">
      {showCentered && eventRef.current && (
        <>
      <div className={styles.darken}></div>
          <div
            id = 'lore'
        className={`${styles.centered} ${styles.hovered} ${styles.lore}`}
        dangerouslySetInnerHTML={{ __html: eventRef.current.innerHTML }}
          ></div>
          </>
       )}
      <div className={styles.header}>
        {status == "done" && (
          <Cell
            handleFetch={handleFetch}
            input={input}
            handleEvent={handleEvent}
            handleChange={handleChange}
            status={status}
          />
        )}
        <div>SkyFluffy</div>
      </div>
      {status == "idle" && (
        <Cell
          handleFetch={handleFetch}
          input={input}
          handleEvent={handleEvent}
          handleChange={handleChange}
          status={status}
        />
      )}
      {data && (
        <div className={styles.flex}>
          <div ref={originalRef} className={styles.wrapper}>
            <canvas ref={canvasRef}></canvas>
          </div>
          <div className={styles.display}>
            <div className={styles.parent}>
              <div className={styles.profile}>
                Showing data for
                <div className={styles.name}>{data.account.name}</div> on
                <div className={styles.name} style={{ width: "max-content" }}>
                  {data.account.profile}
                </div>
              </div>
              <div className={styles.title}>STATS</div>
              <hr />
              <div ref={appendRef} className={styles.stats}>
                {/* {Object.keys(data.profiles[key].data.stats).map((statKey, index) => {
              
              //  return  <Stat key = {index} name= {statKey} stats = {stats[statKey]} vale = {data.profiles[key].data.stats[statKey]} />
              
            })
            } */}
              </div>
              <div className={styles.title}>SKILLS</div>
              <hr />

              <div className={styles.skill}>
                {Object.keys(data.skills).map((skill, index) => {
                  return (
                    <Skill
                      key={index}
                      name={skill}
                      level={data.skills[skill].level}
                      xp={data.skills[skill].xp}
                      nextXp={data.skills[skill].nextXp}
                      overflow={data.skills[skill].overflow}
                    />
                  );
                })}
              </div>
              <div className={styles.tab}>
                <div
                  className={styles.title}
                  onClick={() => {
                    setTab("inventory");
                  }}
                >
                  INVENTORY
                </div>
                <div
                  className={styles.title}
                  onClick={() => {
                    setTab("enderchest");
                  }}
                >
                  ENDER CHEST
                </div>
                <div
                  className={styles.title}
                  onClick={() => {
                    setTab("armor");
                  }}
                >
                  ARMOR
                </div>
                <div
                  className={styles.title}
                  onClick={() => {
                    setTab("talisman");
                  }}
                >
                  TALISMAN BAG
                </div>
                <div
                  className={styles.title}
                  onClick={() => {
                    setTab("pets");
                  }}
                >
                  PETS
                </div>
              </div>
              {tab == "pets" && <Pets pets={data.inventory.pets} />}
              {tab != "pets" && (
                <Inventory tab={tab} inventory={data.inventory} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
