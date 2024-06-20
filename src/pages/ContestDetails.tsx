import React, {ReactNode} from "react";
import {ResourceData} from "@disruptph/json-api-normalizer";
import {Contest, CandidateAttributes, PartyAttributes} from "../interfaces";
import PartySwatch from "../components/PartySwatch/PartySwatch";
import {Gadget, GadgetGroup} from "../components/Gadget/Gadget";

interface ContestDetailsProps {
  contest: ResourceData<Contest>
  candidates_data: {[id: string] : ResourceData<CandidateAttributes>}
  parties_data: {[id: string] : ResourceData<PartyAttributes>}
}

function ContestDetails({contest: contest, candidates_data: candidates_data, parties_data: parties_data} : ContestDetailsProps) {

  const candidates = contest.relationships.fieldCandidates.data as ResourceData[];

  const contestDeclared = contest.attributes.moderationState == "declared";

  var votesArray: number[] = [];
  var majority = 0;
  var numElected = 0;

  const rows = candidates.map((candidate_link) => {

    const candidate_res = candidates_data[candidate_link.id];
    const party_link = candidate_res.relationships.fieldParty.data as ResourceData;
    const candidate = candidate_res.attributes as CandidateAttributes;

    votesArray.push(candidate.fieldVotesWon)

    if(candidate.fieldElected){
      numElected++;
    }

    const party = party_link ? parties_data[party_link.id].attributes : {} as PartyAttributes;

    var splitLabel = candidate.label.split(", ");
    splitLabel[0] = splitLabel[0].toUpperCase();

    const name = splitLabel.join(", ");

    return (
      <tr key={candidate.id} className={candidate.fieldElected ? "elected" : "" }>
        <td className="swatch" style={{"backgroundColor": party.fieldColor?.color ?? "transparent" }}></td>
        <td>
          {name}
        </td>
        <td>{candidate.fieldPartyName}</td>
        <td className="votes">{contestDeclared ? candidate.fieldVotesWon : ""}</td>
        <td className="elected">{contestDeclared && candidate.fieldElected ? "Yes" : ""}</td>
      </tr>
    )
  });

  votesArray = votesArray.sort((n1,n2) => n1 - n2).reverse();
  majority = votesArray[numElected-1] - votesArray[numElected];

  return (
    <div className={"contestDetail"} style={{fontSize: "28px"}}>
      <table className="resultsTable">
        <thead>
        <tr>
          <th/>
          <th>Candidate</th>
          <th>Description</th>
          <th className="votes">Votes</th>
          <th className="elected">Elected</th>
        </tr>
        </thead>
        <tbody>
        {rows}
        </tbody>
        <tfoot>
        <tr>
          <td colSpan={4}>
            <GadgetGroup>
              {contest.attributes.fieldEligibleElectorate && <Gadget name="Electorate" value={contest.attributes.fieldEligibleElectorate.toString()} />}
              {contest.attributes.fieldTurnout && <Gadget name="Turnout" value={`${contest.attributes.fieldTurnout} (${contest.attributes.fieldTurnoutPercentage}%)`} />}
              {(contestDeclared && contest.attributes.fieldRejectedPapers !== null) && <Gadget name="Rejected papers" value={contest.attributes.fieldRejectedPapers} />}
              { (!isNaN(majority)) && <Gadget name="Majority" value={majority.toString()} />}
            </GadgetGroup>
          </td>
        </tr>

        </tfoot>
      </table>
    </div>
  );

}


export default ContestDetails;
