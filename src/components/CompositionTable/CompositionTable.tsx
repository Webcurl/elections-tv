import React from "react";
import {CouncillorSummaryDataRow} from "../../pages/CouncilComposition";
import PartySwatch from "../PartySwatch/PartySwatch";

interface MakeupTableProps {
  data: CouncillorSummaryDataRow[]
}

export default function CompositionTable (props : MakeupTableProps) {

  var totalPreComp = 0;
  var totalContested = 0;
  var totalPostComp = 0;
  var totalUnannounced = 0;

  const rows = props.data.map((row) => {

    totalPreComp += row.beforeCount;
    totalContested += row.contestedCount;
    totalPostComp += row.afterCount;

    return <tr key={row.partyName}>
      <td className="swatch"><PartySwatch color={row.partyColor}/></td>
      <td>{row.partyName}</td>
      <td className="text-right">{row.beforeCount}</td>
      <td className="text-right">{row.contestedCount}</td>
      <td className="text-right">{row.afterCount}</td>
    </tr>;
  });

  // For review
  totalUnannounced = Math.max(0, (totalPreComp - totalPostComp));

  return (
    <table>
      <thead>
      <tr>
        <th></th>
        <th>Party</th>
        <th className="text-right">Pre-election composition</th>
        <th className="text-right">Contested</th>
        <th className="text-right">Post-election composition</th>
      </tr>
      </thead>
      <tbody>
      {rows}
      <tr>
        <td></td>
        <td>Unannounced Seats</td>
        <td className="text-right"></td>
        <td className="text-right"></td>
        <td className="text-right">{totalUnannounced}</td>
      </tr>
      <tr className="composition-table-footer">
        <td className="swatch"></td>
        <td>Total</td>
        <td className="text-right">{totalPreComp}</td>
        <td className="text-right">{totalContested}</td>
        <td className="text-right">{totalPostComp}</td>
      </tr>
      <tfoot>
        
      </tfoot>
      </tbody>

    </table>

  );

}
