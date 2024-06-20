import React, { Fragment } from "react";
import {ResourceData} from "@disruptph/json-api-normalizer";
import {Area, CandidateAttributes, Contest, PartyAttributes} from "../interfaces";

interface TurnoutPageProps {
  contests: ResourceData<Contest>[]
  candidates_data: {[id: string] : ResourceData<CandidateAttributes>}
  parties_data: {[id: string] : ResourceData<PartyAttributes>}
  areas_data: {[id: string] : ResourceData<Area>}
}

export default function TurnoutPage({contests, candidates_data, parties_data, areas_data}: TurnoutPageProps) {

  // Sort contests by ward here alphabetically
  contests.sort(function(a, b){
    const contest_a_link = a.relationships.fieldElectoralArea.data as ResourceData
    const contest_b_link = b.relationships.fieldElectoralArea.data as ResourceData
    const a_area = areas_data[contest_a_link.id].attributes as Area
    const b_area = areas_data[contest_b_link.id].attributes as Area

    return a_area.name.localeCompare(b_area.name)
  })

  const summary_list = contests.map((contest) => {
    const area_link = contest.relationships.fieldElectoralArea.data as ResourceData;
    const area = areas_data[area_link.id].attributes as Area;

    return (
      <tr key={contest.id}>
        <td>{area.name}</td>
        <td className="text-right">{contest.attributes.fieldEligibleElectorate}</td>
        <td className="text-right">{contest.attributes.fieldTurnout}</td>
        <td className="text-right">{contest.attributes.fieldTurnoutPercentage}</td>
      </tr>
    );
  });

  const summary_1 = summary_list.slice(0,(summary_list.length/2));
  const summary_2 = summary_list.slice(summary_list.length/2, summary_list.length)

  return (
    <div style={{display: "flex", flexDirection: "row"}}>
      <table style={{margin: "1rem", marginRight: "2rem"}}>
        <thead>
        <tr>
          <th>Ward</th>
          <th className="text-right">Electorate</th>
          <th className="text-right">Turnout</th>
          <th className="text-right">%</th>
        </tr>
        </thead>

        {summary_1}
      </table>
      <table style={{margin: "1rem", marginLeft: "2rem"}}>
        <thead>
        <tr>
          <th>Ward</th>
          <th className="text-right">Electorate</th>
          <th className="text-right">Turnout</th>
          <th className="text-right">%</th>
        </tr>
        </thead>

        {summary_2}
      </table>
    </div>
  );


}
