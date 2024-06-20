import React, {Fragment} from "react";
import CouncillorChart from "../components/CouncillorChart/CouncillorChart";
import {ResourceData} from "@disruptph/json-api-normalizer";
import {CandidateAttributes, PartyAttributes, SeatMakeupAttributes} from "../interfaces";
import CompositionChart from "../components/CompositionChart/CompositionChart";
import CompositionTable from "../components/CompositionTable/CompositionTable";


export interface CouncillorSummaryDataRow {
  partyName: string
  partyColor: string
  beforeCount: number
  afterCount: number
  contestedCount: number
}

interface CouncilCompositionProps {
  previous_seat_makeup_data: {[id: string] : ResourceData<SeatMakeupAttributes>}
  candidates_data: {[id: string] : ResourceData<CandidateAttributes>}
  parties_data: {[id: string] : ResourceData<PartyAttributes>}
}

function CouncilComposition({candidates_data, parties_data, previous_seat_makeup_data} : CouncilCompositionProps) {


  const standing_candidates_stats: Map<string, number> = Object.values(candidates_data)
    .reduce((parties, candidate) => {
      const party_link = candidate.relationships.fieldParty.data as ResourceData | null;
      const party_id = party_link?.id ?? "_none";
      const seats = candidate.attributes.fieldElected ? 1 : 0;
      parties.set(party_id, (parties.get(party_id) || 0) + seats);
      return parties;
    }, new Map<string, number>());

  const current_makeup_stats: Map<string, number> = Object.values(previous_seat_makeup_data)
    .filter((seat) => !seat.attributes.fieldContested)
    .reduce((parties, seat) => {
      const party_link = seat.relationships.fieldParty.data as ResourceData | null;
      const party_id = party_link?.id ?? "_none";
      parties.set(party_id, (parties.get(party_id) || 0) + 1);
      return parties;
    }, standing_candidates_stats);

  const contested_makeup_stats: Map<string, number> = Object.values(previous_seat_makeup_data)
    .filter((seat) => seat.attributes.fieldContested)
    .reduce((parties, seat) => {
      const party_link = seat.relationships.fieldParty.data as ResourceData | null;
      const party_id = party_link?.id ?? "_none";
      parties.set(party_id, (parties.get(party_id) || 0) + 1);
      return parties;
    }, new Map<string, number>());

  const previous_makeup_stats: Map<string, number> = Object.values(previous_seat_makeup_data)
    .reduce((parties, seat) => {
      const party_link = seat.relationships.fieldParty.data as ResourceData | null;
      const party_id = party_link?.id ?? "_none";
      parties.set(party_id, (parties.get(party_id) || 0) + 1);
      return parties;
    }, new Map<string, number>());

  const stats:Map<string, CouncillorSummaryDataRow> = new Map();

  for (const [party, count] of current_makeup_stats.entries()) {
    const row = generateDataRow(party);
    row.afterCount = count;
    stats.set(party, row)
  }

  for (const [party, count] of previous_makeup_stats.entries()) {
    const row = stats.get(party) || generateDataRow(party);
    row.beforeCount = count;
    stats.set(party, row)
  }

  for (const [p, c] of contested_makeup_stats.entries()) {
    const row = stats.get(p) || generateDataRow(p);
    row.contestedCount = c;
    stats.set(p, row);
  }

  //for (const [party, count] of )

  function generateDataRow(party_id:string):CouncillorSummaryDataRow {
    if (party_id == "_none" || !parties_data[party_id]) {
      return {
        partyName: "Others",
        partyColor: "#eee",
        beforeCount: 0,
        afterCount: 0,
        contestedCount: 0
      }
    } else {
      return {
        partyName: parties_data[party_id].attributes.fieldShortName,
        partyColor: parties_data[party_id].attributes.fieldColor.color,
        beforeCount: 0,
        afterCount: 0,
        contestedCount: 0
      };
    }
  }

  function compareParties(a: CouncillorSummaryDataRow, b: CouncillorSummaryDataRow): number {
    return b.afterCount - a.afterCount || a.partyName.localeCompare(b.partyName)
  }

  const sorted_stats = Array.from(stats.values()).sort(compareParties);

  const unannounced_count = sorted_stats.reduce((acc, curr) => acc + curr.beforeCount, 0) - sorted_stats.reduce((acc, curr) => acc + curr.afterCount, 0);

  return (
    <Fragment>
      <div className={"composition-visuals"} style={{display: "flex", marginBottom: "1em"}}>
        <div style={{textAlign: "center"}}><h2>Pre-election Composition</h2><CompositionChart title="Before" data={sorted_stats} countField={"beforeCount"} unannouncedCount={0} /></div>
        <div style={{textAlign: "center"}}><h2>Post-election Composition</h2><CompositionChart title="After" data={sorted_stats} countField={"afterCount"} unannouncedCount={unannounced_count} /></div>
        <div style={{flexGrow: 1}}><CouncillorChart data={sorted_stats} countField={"afterCount"} unannouncedCount={unannounced_count} /></div>
      </div>
      <CompositionTable data={sorted_stats} />
    </Fragment>
  );
}

export default CouncilComposition;
