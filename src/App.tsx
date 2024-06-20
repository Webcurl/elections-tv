import React, { useState } from 'react';
import useSWR, { Key, Fetcher } from 'swr'
//import logo from './logo.svg';
import './App.css';
import normalize, {Attributes, NormalizedData, ResourceData} from '@disruptph/json-api-normalizer';
import useEventListener from "./useEventListener";

import VotePercentagePage from "./pages/VotePercentagePage";
import ContestDetails from "./pages/ContestDetails";

import {Contest, Area, PartyAttributes, CandidateAttributes, SeatMakeupAttributes, Election} from './interfaces'
import {useInterval} from "./hooks/useInterval";
import PagerDetails from "./components/PagerDetails/PagerDetails";

//import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
import Clock from "./components/Clock/Clock";
import ContestSummary from "./pages/ContestSummary";
import TurnoutPage from "./pages/TurnoutPage";
import CouncilComposition from "./pages/CouncilComposition";
Chart.register(ArcElement);


const fetcher: (args: Request) => Promise<NormalizedData> = (args : Request) => fetch(args)
  .then(res => {
    return res.json().then((data) => {
      return normalize(data);
    });
  });


function App() {

  const base_url = "/jsonapi/localgov_elections_contest/localgov_elections_contest";
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);

  const electionId = parseInt(params.get('electionId') ?? '');
  const [paused, setPaused] = useState(params.get('staystill') === "1");

  const {
    data,
    error
  } = useSWR(base_url + "?filter[field_election.meta.drupal_internal__target_id]=" + electionId + "&include=field_election,field_candidates.field_party,field_electoral_area,field_previous_seat_makeup", fetcher, {refreshInterval: 30000});

  const [pageNum, setPage] = useState(0);

  // Switch pages automatically.
  useInterval(() => {
    if (!paused) {
      setPage((pageNum) => ++pageNum % playlist.length);
    }
  }, 10000);


  useEventListener("keydown", ({key}) => {

    if (key == 'ArrowRight') {
      setPage((pageNum) => ++pageNum % playlist.length);
    } else if (key == 'ArrowLeft') {
      setPage((pageNum) => (pageNum + playlist.length - 1) % playlist.length);
    } else if (key == ' ') {
      setPaused((paused) => !paused);
    }
  })

  interface PageInterface {
    type: "ContestSummary" | "VotePercentagePage" | "ContestDetails" | "TurnoutPage" | "CouncilComposition"
    data?: any
  }

  if (error) {
    console.log(error);
    return <div>failed to load</div>
  }
  if (!data) return <div>loading...</div>

  const contests_data = data.localgovElectionsContestLocalgovElectionsContest;

  if (!contests_data) {
    return <div>Error: failed to load contest data for provided election ID.</div>
  }
  const contests = Object.values(contests_data) as ResourceData<Contest>[];

  // Sort contests
  const contests_sorted = contests.sort(function(a, b){
    const contest_a_link = a.relationships.fieldElectoralArea.data as ResourceData
    const contest_b_link = b.relationships.fieldElectoralArea.data as ResourceData
    const a_area = data.taxonomyTermLocalgovElectionsArea[contest_a_link.id].attributes as Area
    const b_area = data.taxonomyTermLocalgovElectionsArea[contest_b_link.id].attributes as Area

    return a_area.name.localeCompare(b_area.name)
  });

  const election = Object.values(data.nodeLocalgovElection)[0] as ResourceData<Election>;

  const playlist: PageInterface[] = [
    {type: "ContestSummary"}
  ];

  if (election.attributes.fieldElectionDisplayMakeup) {
    playlist.push({type: "CouncilComposition"});
  }

  playlist.push({type: "TurnoutPage"});

  for (const contest of contests_sorted) {
    playlist.push({type: "ContestDetails", data: contest})
  }

  const currentPage = () => playlist[pageNum];

  let page;
  let title;

  if (currentPage().type == "ContestDetails") {
    const contest = currentPage().data as ResourceData<Contest>;
    const area_link = contest.relationships.fieldElectoralArea.data as ResourceData;
    const area = data.taxonomyTermLocalgovElectionsArea[area_link.id].attributes as Area;

    title = area.name;

    page = <ContestDetails
      contest={contest}
      parties_data={data.taxonomyTermLocalgovElectionsParty as { [key: string]: ResourceData<PartyAttributes> }}
      candidates_data={data.localgovElectionsCandidateLocalgovElectionsCandidate as { [key: string]: ResourceData<CandidateAttributes> }}/>
  }
  else if (currentPage().type == "VotePercentagePage") {
    page = <VotePercentagePage
      candidates={data.localgovElectionsCandidateLocalgovElectionsCandidate as { [key: string]: ResourceData<CandidateAttributes> }}
      parties={data.taxonomyTermLocalgovElectionsParty as { [key: string]: ResourceData<PartyAttributes> }}/>

    title = "Vote Summary";
  }
  else if (currentPage().type == "TurnoutPage") {
    page = <TurnoutPage
      contests={contests}
      candidates_data={data.localgovElectionsCandidateLocalgovElectionsCandidate as { [key: string]: ResourceData<CandidateAttributes>}}
      parties_data={data.taxonomyTermLocalgovElectionsParty as { [key: string]: ResourceData<PartyAttributes> }}
      areas_data={data.taxonomyTermLocalgovElectionsArea as { [key: string]: ResourceData<Area> }} />
    title = "Turnout Summary";
  }
  else if (currentPage().type == "CouncilComposition") {
    page = <CouncilComposition
      previous_seat_makeup_data={(data.paragraphElectionSeat|| {} ) as { [key: string]: ResourceData<SeatMakeupAttributes>}}
      candidates_data={data.localgovElectionsCandidateLocalgovElectionsCandidate as { [key: string]: ResourceData<CandidateAttributes>}}
      parties_data={data.taxonomyTermLocalgovElectionsParty as { [key: string]: ResourceData<PartyAttributes> }}
    />;
    title = "Council composition";
  }
  else {
    page = <ContestSummary
      contests={contests}
      candidates_data={data.localgovElectionsCandidateLocalgovElectionsCandidate as { [key: string]: ResourceData<CandidateAttributes>}}
      parties_data={data.taxonomyTermLocalgovElectionsParty as { [key: string]: ResourceData<PartyAttributes> }}
      areas_data={data.taxonomyTermLocalgovElectionsArea as { [key: string]: ResourceData<Area> }} />
    title = "Overview";
  }

  return (
    <div className="App">
      <header className="top">
        <img src={"/themes/custom/mkc_theme/MK_HERO_LOGO_WHITE.svg"} />
        <h2>{title}</h2>
        <div className={"clock"}><Clock /></div>
      </header>

      <main>

        {page}

      </main>

      <footer><PagerDetails pageNum={pageNum + 1} pagesTotal={playlist.length} /> {paused ? "(paused)" : ""}</footer>
    </div>
  );
}

export default App;
