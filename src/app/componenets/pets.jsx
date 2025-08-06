import styles from "../../../styles/pets.module.css";
import Image from "next/image";
import ToolTip from "./tooltip";

export default function Pets(props) {
  console.log(props)
 if(!props.pets) return
  return (
    <div className = {styles.container}>
      {props.pets?.map((pet, index) => (
        <div key={`${index }-${pet.exp}`} className={styles.pet}>
          <Image
            src={`/items/${pet.src}.png`}
            alt=""
            height={75}
            width={75}
            unoptimized={true}
            style={{
              imageRendering: "pixelated"
                }}
            className= {styles.glint}
            quality={100}
          />
          {pet.lore && <ToolTip item={pet} />}
        </div>
      ))}
    </div>
  );
}
