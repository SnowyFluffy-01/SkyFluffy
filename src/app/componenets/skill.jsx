
import styles from "../../../styles/skill.module.css";
import Image from "next/image";
import formatNumber from "../../lib/utils/formatNumber.js";
function Skill({ name, level, overflow, xp, nextXp }) {
  const barWidth = nextXp ? Math.floor((xp / nextXp) * 100) : 100
  name = name.slice(0, 1).toUpperCase() + name.slice(1);
  xp = formatNumber(xp)
  overflow == overflow && formatNumber(overflow);
  const isMax = barWidth > 99
  const source = `/skills/${name}.png`;

  return (
    <div className={styles.container}>
      <div
        className={styles.image}
        style={{ backgroundColor: isMax ? "gold" : "green" }}
      >
        <Image className = {styles.skill} width={50} height={50} alt="" src={source} />
      </div>
      <div className={styles.name}> {`${name} ${level}`} </div>

      <div className={styles.barContainer}>
        <div
          className={styles.bar}
          style={{
            width: `${barWidth}%`,
            backgroundColor: isMax ? "gold" : "green",
          }}
        ></div>
        <div className={styles.xp}>
          {overflow ? overflow + " OVERFLOW" : xp}
        </div>
      </div>
    </div>
  );
}

export default Skill;
