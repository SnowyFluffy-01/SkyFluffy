import { createPortal } from "react-dom";
import styles from "../../../styles/inventory.module.css";
export default function CenteredTooltip({ item }) {
    console.log(item)
    if(!item || !item.id || !item.name) return null
    return createPortal(
      <>
        <div className={styles.darken} />
        <div id="center" className={`${styles.centered} ${styles.lore}`}>
          <div
            className={styles.name}
            dangerouslySetInnerHTML={{ __html: item.name }}
          ></div>
          {item.lore.map((line, lineIndex) => (
            <div
              key={lineIndex}
              dangerouslySetInnerHTML={{ __html: line }}
            ></div>
          ))}
        </div>
      </>,
      document.body
    );
}