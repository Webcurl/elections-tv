import React from "react";
import VotePercentage, {PartyPercentageData} from "../VotePercentage";
import {ResourceData} from "@disruptph/json-api-normalizer";
import {CandidateAttributes, PartyAttributes} from "../interfaces";

interface VotePercentagePageProps {
  candidates: {[id: string] : ResourceData<CandidateAttributes>}
  parties: {[id: string] : ResourceData<PartyAttributes>}
}

function VotePercentagePage({candidates: candidates, parties: parties} : VotePercentagePageProps) {

  const party_votes : {[id: string] : number} = {};

  let independents = 0;

  for (const candidate_res of Object.values(candidates) as ResourceData<CandidateAttributes>[]) {
    const party_link = candidate_res.relationships.fieldParty.data as ResourceData;

    if (party_link) {
      party_votes[party_link.id] = party_votes[party_link.id] || 0;
      party_votes[party_link.id] += candidate_res.attributes.fieldVotesWon;
    }
    else {
      independents += candidate_res.attributes.fieldVotesWon;
    }
  }

  const partyData : PartyPercentageData[] = Object.entries(party_votes).map(([party_id, votes]) => {
    return {
      party: parties[party_id].attributes.name as string,
      color: parties[party_id].attributes.fieldColor.color as string,
      votes: votes as number
    };
  });

  partyData.push({
    party: "Independent",
    color: "transparent",
    votes: independents
  })

  return VotePercentage({data: partyData});
}

export default VotePercentagePage;
