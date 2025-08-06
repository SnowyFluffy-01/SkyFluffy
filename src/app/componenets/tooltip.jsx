
import styles from '../../../styles/tooltip.module.css'
import { useTooltip } from "./context";

export default function ToolTip({ item }) {
  if (!item.lore) return
  const { eventRef, deactivatedRef, setShowCentered} = useTooltip()
  function showLore(e) {
    const loreTooltip = e.currentTarget.nextElementSibling;
      if (deactivatedRef.current || !loreTooltip) return;
    const rect = loreTooltip.getBoundingClientRect();
    const mousePos = e.clientX - rect.left;
    const left = mousePos <= Math.floor(rect.width / 2);
  loreTooltip.classList.toggle(styles.hovered);
    loreTooltip.style.left = left ? "7rem" : null;
    loreTooltip.style.right = !left ? "7rem" : null;
  }

  function hideLore(e) {
    const loreTooltip = e.currentTarget.nextElementSibling
    if (deactivatedRef.current || !loreTooltip) return;
    loreTooltip.classList.toggle(styles.hovered)

  }
  function appendLore(e) {
    e.stopPropagation();
    const loreTooltip = e.currentTarget.nextElementSibling
    if (!loreTooltip) return;
     loreTooltip.classList.toggle(styles.hovered);
    loreTooltip.style.left = null;
    setShowCentered(true)
    deactivatedRef.current = true
    eventRef.current = e.currentTarget.nextElementSibling;
  }
  return (
    <>
      <div
        className={styles.tooltip}
        onMouseEnter = {showLore}
        onClick={appendLore}
        onMouseLeave={hideLore}
      ></div>

      <div className={`${styles.lore} ${styles.hidden}`}>
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
      </div>
     
    </>
  );
}
