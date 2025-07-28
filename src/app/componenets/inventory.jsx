import Image from "next/image";
import styles from "../../../styles/inventory.module.css";
import { useEffect, Fragment, useRef, useState } from "react";
import CenteredTooltip from "./centered";
export default function Inventory(props) {
  const inventories = {
    enderchest: props.inventory.ender,
    inventory: props.inventory.inv,
    armor: props.inventory.armor,
    equipment: props.inventory.equipment,
    talisman: props.inventory.talisman,
  };
  const eventRef = useRef(null);
  const deactivatedRef = useRef(false);
  const [tooltipData, setTooltipData] = useState();
  useEffect(() => { 
    const handleClick = (e) => {
      if(!eventRef.current) return
      if (
        eventRef.current &&
        (eventRef.current?.contains(e.target) ||
          eventRef.current?.nextElementSibling?.contains(e.target))
      ) {
        console.log('IOM RETURNINGIGNIGNGINI')
        return
      };
      console.log('heheheh');
      const loreTooltip = eventRef.current?.nextElementSibling ? eventRef.current?.nextElementSibling : null
      if (loreTooltip) {
        console.log(loreTooltip);
         setTooltipData(null)
        loreTooltip.classList.remove(styles.centered);
        loreTooltip.classList.add(styles.hidden)
        loreTooltip.classList.remove(styles.hovered);
        console.log(loreTooltip);
        deactivatedRef.current = false
      
      }
    };
    
      window.addEventListener("click", handleClick);
  return () => window.removeEventListener('click', handleClick)
  }, []);

  function showLore(e) {
    const loreTooltip = e.currentTarget.nextElementSibling;

    if (deactivatedRef.current || !loreTooltip) return;
    const rect = document.querySelector(`#container`).getBoundingClientRect();
    const mousePos = e.clientX - rect.left;
    const left = mousePos <= Math.floor(rect.width / 2);
    loreTooltip.classList.remove(styles.hidden);
    loreTooltip.classList.add(styles.hovered)
    loreTooltip.style.left = left ? "7rem" : null;
    loreTooltip.style.right = !left ? "7rem" : null;
  }

  function hideLore(e) {
    const loreTooltip = e.currentTarget.nextElementSibling;
    if (deactivatedRef.current || !loreTooltip) return;
    loreTooltip.classList.add(styles.hidden);
    loreTooltip.classList.remove(styles.hovered);
    console.log("hideee");
    
  }
  function appendLore(e, item) {
    e.stopPropagation()
    const loreTooltip = e.currentTarget.nextElementSibling;
    if (!loreTooltip) return;
    console.log("hell;o");
    loreTooltip.classList.add(styles.hidden);
    loreTooltip.classList.remove(styles.hovered);
    setTooltipData(item);
  
    loreTooltip.style.left = null
    deactivatedRef.current = true;
    console.log(item)

 
    eventRef.current = e.currentTarget;
  }
  return (
    <>
      {props.inventory.inv && (
        <div
          className={
            props.tab == "enderchest" || props.tab == "talisman"
              ? styles.pagedInv
              : styles.inv
          }
          id="container"
        >
          {tooltipData && <CenteredTooltip item={tooltipData} /> }
          {inventories[props.tab].map((item, index) => (
            <Fragment key={`slot-${index}-${item.id}`}>
              <div className={styles.item}>
                {item.id && (
                  <Image
                    height={75}
                    width={75}
                    onMouseEnter={showLore}
                    unoptimized = {true}
                    style={{
                      imageRendering: 'pixelated'
                    }}
                    quality={100}
                    onClick={(e) => appendLore(e, item)}
                    onMouseLeave={hideLore}
                    className={styles.glint}
                    src={`/items/${item.src}.png`}
                    alt=""
                  />
                )}
                <div
                  className={`${styles.lore} ${styles.hidden}`}
                >
                  {item.id && (
                    <>
                      <div
                        className={styles.name}
                        dangerouslySetInnerHTML={{ __html: item.name }}
                      ></div>
                      {item.lore?.map((line, lineIndex) => (
                        <div
                          key={lineIndex}
                          dangerouslySetInnerHTML={{ __html: line }}
                        ></div>
                      ))}
                    </>
                  )}
                </div>
              </div>
              {props.tab == "inventory" && index == 27 && (
                <hr className={styles.spacer} />
              )}
              {(props.tab == "talisman" || props.tab == "enderchest") &&
                (index + 1) % 45 == 0 && <hr className={styles.enderSpacer} />}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
}
