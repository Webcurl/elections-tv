import React, { Fragment } from "react";
import {ResourceData} from "@disruptph/json-api-normalizer";
import {Area, CandidateAttributes, Contest, PartyAttributes} from "../interfaces";
import ElectedCandidate from "../components/ElectedCandidate/ElectedCandidate";
import PartySwatch from "../components/PartySwatch/PartySwatch";

interface ContestSummaryProps {
  contests: ResourceData<Contest>[]
  candidates_data: {[id: string] : ResourceData<CandidateAttributes>}
  parties_data: {[id: string] : ResourceData<PartyAttributes>}
  areas_data: {[id: string] : ResourceData<Area>}
}

export default function ContestSummary({contests, candidates_data, parties_data, areas_data}: ContestSummaryProps) {

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

    const candidate_links = contest.relationships.fieldCandidates.data as ResourceData[];
    const candidates = candidate_links ? candidate_links.map((candidate_link) => candidates_data[candidate_link.id] as ResourceData<CandidateAttributes>) : [];

    const elected_candidate_parties = candidates
      .filter((candidate) => candidate.attributes.fieldElected)
      .map((candidate) => {
        const party_link = candidate.relationships.fieldParty.data as ResourceData | null;
        return party_link ? parties_data[party_link.id].attributes : {} as PartyAttributes;
      });


    if (contest.attributes.moderationState === "declared") {
      const swatches = elected_candidate_parties.map((party) => <PartySwatch
        color={party.fieldColor?.color ?? "transparent"}/>)
      const summaries = elected_candidate_parties.map((party) => {
        return party.fieldAbbreviatedName + " Win";
      }).join(', ');

      return (
        <tr>
          <td className={"swatch"}>{swatches}</td>
          <td>{area.name}</td>
          <td>{summaries || "No candidate elected"}</td>
        </tr>
      );
    }
    else {
      return (
        <tr>
          <td className={"swatch"} />
          <td>{area.name}</td>
          <td>Awaiting Results</td>
        </tr>
      );
    }
  });

  if (summary_list.length < 5) {
    return (
      <div className="contestSummary" style={{display: "flex"}}>
        <table>
          <tbody>
          {summary_list}
          </tbody>
        </table>
      </div>
    );
  }

  const pivot = Math.floor(summary_list.length / 2);

  return (
    <div className="contestSummary" style={{display: "flex"}}>
      <table key={"left"}>
        <tbody>
        {summary_list.slice(0, pivot)}
        </tbody>
      </table>
      <table key={"right"}>
        <tbody>
        {summary_list.slice(pivot)}
        </tbody>
      </table>
    </div>
  );

}
