import  React, { useState , useEffect } from 'react'
import styles from './Clock.module.css'

export default function Clock() {

  var [date,setDate] = useState(new Date());

  useEffect(() => {
    var timer = setInterval(()=>setDate(new Date()), 1000 )
    return function cleanup() {
      clearInterval(timer)
    }
  });

  const time = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  const time_components = time.split(':');


  return(
    <div className={styles.clockWidget}>
      {time_components[0]}
      <span className={styles.separator}>:</span>
      {time_components[1]}
    </div>
  )
}
