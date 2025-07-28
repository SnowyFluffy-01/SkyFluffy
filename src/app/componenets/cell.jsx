import styles from "../../../styles/cell.module.css";
import SearchIcon from "@mui/icons-material/Search";
export default function Cell(props) {
  return (
   <>
      <div className={props.status == "done" ? styles.inlineFlex : styles.cellFlex}>
      
        {props.status == 'idle' && <div className= {styles.text}>View your SB profile</div>}
          <div>
            <input
              id="input"
              value={props.input}
              className={styles.input}
              placeholder="Enter IGN"
            onChange={props.handleChange}
            onKeyDown={props.handleEvent}
            />
          </div>
          { <div>
            <SearchIcon
              sx={{
                "&:hover": {
                  color: "gray",
                },
              }}
              onClick={props.handleFetch}
            />
          </div> }
        
      </div>
</>
  );
}
