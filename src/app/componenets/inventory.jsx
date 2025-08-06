import Image from "next/image";
import styles from "../../../styles/inventory.module.css";
import {Fragment} from "react";
import ToolTip from "./tooltip";
import { useTooltip } from "./context";
import CenteredTooltip from "./centered";
export default function Inventory(props) {
      const { eventRef, showCentered} = useTooltip()
  const inventories = {
    enderchest: props.inventory.ender,
    inventory: props.inventory.inv,
    armor: props.inventory.armor,
    equipment: props.inventory.equipment,
    talisman: props.inventory.talisman,
  };

 
  
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
          {inventories[props.tab].map((item, index) => (
            <Fragment key={`slot-${index}-${item.id}`}>
              <div className={styles.item}>
                {item.src && (
                  <Image
                    height={75}
                    width={75}
                    style={{
                      imageRendering: "pixelated",
                    }}
                    quality={100}
                    className={styles.glint}
                    src={`/items/${item.src}.png`}
                    alt=""
                  />
                )}
                {item.lore && <ToolTip item={item} />}
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
