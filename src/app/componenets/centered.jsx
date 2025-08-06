import { createPortal } from "react-dom";
import styles from "../../../styles/tooltip.module.css";

export default function CenteredTooltip({node}) {
    if(!node) return null
    console.log('passed')
    return createPortal(
      
      <>

        </>,
      document.body
    );
}