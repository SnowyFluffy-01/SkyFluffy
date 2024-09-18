import styles from './stat.module.scss'

function Stat({name, icon, value}) {
console.log("🚀 ~ Stat ~ {name, icon, value:", name, icon, value)



    return (
        <div>
         <div className ={styles.icon}> {icon}</div>
         <div className = {styles.name}>{name}</div>
         <div className = {styles.value}>{value}</div>
        </div> 
    )
}

export default Stat