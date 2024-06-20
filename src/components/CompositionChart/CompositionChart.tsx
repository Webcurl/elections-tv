import {Doughnut} from "react-chartjs-2";
import React from "react";
import {Chart as ChartJS, ChartData, Title, Legend, Tooltip} from "chart.js";
import {CouncillorSummaryDataRow} from "../../pages/CouncilComposition";

interface CompositionChartProps {
  title: string
  data: CouncillorSummaryDataRow[]
  countField: keyof CouncillorSummaryDataRow
  unannouncedCount: number
}

export default function CompositionChart (props : CompositionChartProps) {

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
    if (party[props.countField] > 0) {
      data.datasets[0].data.push(party[props.countField]);
      data.datasets[0].backgroundColor.push(party.partyColor);
      data.labels.push(party.partyName);
    }
  }

  if (props.unannouncedCount > 0) {
    data.datasets[0].data.push(props.unannouncedCount);
    data.datasets[0].backgroundColor.push("#eee");
    data.labels.push("Unannounced");
  }

  ChartJS.register(Tooltip, Legend);

  return <div style={{width: "65%", margin: "auto"}}>
    <Doughnut
      options={{
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: props.title
          }
        }
      }}
      data={data} />
  </div>;

}
