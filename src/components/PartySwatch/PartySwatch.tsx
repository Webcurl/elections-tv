import styles from "./PartySwatch.module.css";
import React from "react";

interface PartySwatchProps {
  color: string
}

export default function PartySwatch({color} : PartySwatchProps) {
  const swatchStyle = {backgroundColor: color};
  return <span className={styles.partySwatch} style={swatchStyle} />;
}
