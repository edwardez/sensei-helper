import type {NextPage} from 'next';
import {Solution} from 'javascript-lp-solver';

import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';
import {Equipment} from 'model/Equipment';

import {Campaign} from 'model/Campaign';
import RecommendedCampaigns from 'components/calculationResult/RecommendedCampaigns';
import CalculationInputCard from 'components/calculationInput/CalculationInputCard';
import {CampaignsById, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import useSWR from 'swr';
import RecommendationsSummary from 'components/calculationResult/RecommendationsSummary';
import IgnoredCampaigns from 'components/calculationResult/IgnoredCampaigns';

const Home: NextPage = observer((props) => {
  const store = useStore();
  const [solution, setSolution] = useState<Solution<string> | null>(null);

  const onSetSolution = (solution: Solution<string> | null) => {
    setSolution(solution);
  };


  const fetcher = (...urls: string[]) => {
    const fetchOne = async <ReturnedDataType, >(url: string) => {
      const res = await fetch(url);
      return (await res.json()) as ReturnedDataType;
    };
    return Promise.all(urls.map(fetchOne));
  };

  const {data, error} = useSWR(['data/equipments.json', 'data/campaigns.json'], fetcher);
  const equipments = data?.[0] as Equipment[];
  const campaigns = data?.[1] as Campaign[];

  const equipmentsById = useMemo(() => equipments?.reduce<EquipmentsById>((prev,
      current) => prev.set(current.id, current), new Map()), [equipments]);
  const campaignsById = useMemo(() => campaigns?.reduce<CampaignsById>((map,
      campaign) => map.set(campaign.id, campaign), new Map()), [campaigns]);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  return <React.Fragment>
    <CalculationInputCard store={store} equipments={equipments}
      campaignsById={campaignsById}
      equipmentsById={equipmentsById}
      onSetSolution={onSetSolution}/>
    {
            solution && solution.result ?
                <React.Fragment>
                  <RecommendationsSummary />
                  <RecommendedCampaigns
                    solution={solution}
                    campaignsById={campaignsById}
                    equipmentsById={equipmentsById}
                    equipmentsRequirementStore={store.equipmentsRequirementStore}
                    normalMissionItemDropRatio={store.gameInfoStore.normalMissionItemDropRatio}/>
                  <IgnoredCampaigns
                    solution={solution}
                    allCampaigns={campaigns}
                    allRequiredPieceIds={store.equipmentsRequirementStore.getAllRequiredPieceIds()}
                    equipmentsById={equipmentsById}
                  />
                </React.Fragment> :
                null
    }
  </React.Fragment>;
});

export default Home;
