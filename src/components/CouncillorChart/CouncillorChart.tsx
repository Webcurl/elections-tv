import React from 'react';
import styles from './CouncillorChart.module.css';
import {CouncillorSummaryDataRow} from "../../pages/CouncilComposition";

interface CouncillorChartProps {
  data: CouncillorSummaryDataRow[]
  countField: keyof CouncillorSummaryDataRow
  unannouncedCount: number
}

export default function CouncillorChart({data, countField, unannouncedCount} : CouncillorChartProps) {

  const meeples = data.map((row) => {
    return <div>{Array.from({length: row[countField] as number}, (_, i) => <span key={`${row.partyName}${i}`} className={styles.meeple} style={{backgroundColor: 'transparent', textShadow: '0 0 0 '+row.partyColor}}>&#128100;</span>)}</div>;
  });

  const vacant = <div>{Array.from({length: unannouncedCount}).map((_, i) => <span key={`unannounced-${i}`} className={`${styles.vacantSeat} ${styles.meeple}`}>&#128100;</span>)}</div>;

  return (<div>{meeples}{vacant}</div>);
}
