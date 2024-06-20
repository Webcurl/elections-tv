import {Doughnut} from "react-chartjs-2";
import React from "react";
import {Chart as ChartJS, ChartData, Title, Legend, Tooltip} from "chart.js";

export interface PartyPercentageData {
  party: string
  color: string
  votes: number
}

interface VotePercentageProps {
  data: PartyPercentageData[]
}

function VotePercentage (props : VotePercentageProps) {

  const data : { datasets: { backgroundColor: any[]; data: any[] }[]; labels: any[] }  = {
    datasets: [
      {
        data: [],
        backgroundColor: []
      }
    ],
    labels: []
  };

  for (const party of props.data) {
    data.datasets[0].data.push(party.votes);
    data.datasets[0].backgroundColor.push(party.color);
    data.labels.push(party.party);
  }

  ChartJS.register(Tooltip, Legend);

  return <div style={{width: "50%"}}>
    <Doughnut
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Share of vote"
          }
        }
      }}
      data={data} />
  </div>;

}

export default VotePercentage;
