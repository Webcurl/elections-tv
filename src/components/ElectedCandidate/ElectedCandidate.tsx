import {CandidateAttributes, PartyAttributes} from "../../interfaces";
import React from "react";
import styles from './ElectedCandidate.module.css';
import PartySwatch from "../PartySwatch/PartySwatch";

interface ElectedCandidateProps {
  candidate: CandidateAttributes
  party: PartyAttributes
}

export default function ElectedCandidate({candidate, party} : ElectedCandidateProps) {
  return (
    <div className={styles.candidate}>
      <PartySwatch color={party.fieldColor?.color ?? "transparent" } /> {candidate.label} elected with {candidate.fieldVotesWon} votes.
    </div>
  );
}
