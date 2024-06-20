import React, {ReactNode} from "react";
import styles from './Gadget.module.css';

export function Gadget(props: { name: string, value: string }) {

  return (
    <div className={styles.gadget}>
      <h3>{props.name}</h3>
      <div className={styles.gadgetValue}>
    {props.value}
    </div>
    </div>
);
}

export function GadgetGroup(props: { children: ReactNode }) {
  return (<div className={styles.gadgetGroup}>
    {props.children}
    </div>);
}

