import styles from "../../../styles/stat.module.scss";

function Stat(props) {
  console.log("🚀 ~ Stat ~ {name, icon, value:", props, props.stats.icon);

  return (
    <div>
      <div
        style={{ color: JSON.stringify(props.stats.color) }}
        className={styles.icon}
      >
        {" "}
        {props.stats.icon}
      </div>
      <div className={styles.name}>{props.name}</div>
      <div className={styles.value}>{props.value}</div>
    </div>
  );
}

export default Stat;
