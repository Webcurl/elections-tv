import {Attributes} from "@disruptph/json-api-normalizer";

export interface Contest extends Attributes {
  fieldEligibleElectorate: number
  fieldTurnout: number
  fieldTurnoutPercentage: number
  moderationState: "draft" | "published" | "counting" | "declared"

}

export interface Election extends Attributes {
  fieldElectionDate: string
  fieldElectionDisplayMakeup: boolean
  status: boolean
  title: string
}

export interface CandidateAttributes extends Attributes {
  label: string
  fieldSurname: string
  fieldForenames: string
  fieldPartyDescription: string
  fieldElected: boolean
  fieldVotesWon: number
  fieldCommonlyUsedForenames: string
  fieldCommonlyUsedSurname: string
}

export interface Area extends Attributes {
  name: string
}

export interface PartyAttributes extends Attributes {
  fieldColor: {color: string, opacity: number}
  fieldShortName: string
  fieldAbbreviatedName: string
}

export interface SeatMakeupAttributes extends Attributes {
  fieldContested: boolean
}
