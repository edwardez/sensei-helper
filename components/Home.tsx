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
import Head from 'next/head';
import {useTranslation} from 'next-i18next';

enum ResultDisplayMode {
  ListStageOnly = 'ListStageOnly',
  LinearProgrammingCalculation = 'LinearProgrammingCalculation'
}

interface CalculationResult {
  mode: ResultDisplayMode;
  linearProgrammingSolution: Solution<string> | null;
}

const Home: NextPage = observer((props) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const [solution, setSolution] = useState<CalculationResult | null>(null);
  const onSetSolution = (solution: Solution<string> | null) => {
    setSolution({
      mode: ResultDisplayMode.LinearProgrammingCalculation,
      linearProgrammingSolution: solution,
    });
  };


  const fetcher = (...urls: string[]) => {
    const fetchOne = async <ReturnedDataType, >(url: string) => {
      const res = await fetch(url);
      return (await res.json()) as ReturnedDataType;
    };
    return Promise.all(urls.map(fetchOne));
  };

  const {data, error} = useSWR(['data/equipments.json', 'data/campaigns.json'], fetcher);
  const allEquipments = data?.[0] as Equipment[];
  const filteredEquipments = useMemo(() => {
    if (!allEquipments) return allEquipments;
    setSolution({
      mode: ResultDisplayMode.LinearProgrammingCalculation,
      linearProgrammingSolution: null,
    });
    const gameServer = store.gameInfoStore.gameServer;
    return allEquipments.filter((equipment) => equipment.releasedIn.includes(gameServer));
  }, [store.gameInfoStore.gameServer, allEquipments]);
  const campaigns = data?.[1] as Campaign[];

  const equipmentsById = useMemo(() => filteredEquipments?.reduce<EquipmentsById>((prev,
      current) => prev.set(current.id, current), new Map()), [filteredEquipments]);
  const campaignsById = useMemo(() => campaigns?.reduce<CampaignsById>((map,
      campaign) => map.set(campaign.id, campaign), new Map()), [campaigns]);

  if (error) return <div>failed to load</div>;

  const buildLinearProgrammingResult = () => {
    if (!solution?.linearProgrammingSolution?.result) return null;

    return <React.Fragment>
      <RecommendationsSummary onCloseInEfficacyDialog={() => onSetSolution(null)}/>
      <RecommendedCampaigns
        solution={solution.linearProgrammingSolution}
        campaignsById={campaignsById}
        equipmentsById={equipmentsById}
        equipmentsRequirementStore={store.equipmentsRequirementStore}
        normalMissionItemDropRatio={store.gameInfoStore.normalMissionItemDropRatio}/>
      <IgnoredCampaigns
        solution={solution.linearProgrammingSolution}
        allCampaigns={campaigns}
        allRequiredPieceIds={store.equipmentsRequirementStore.getAllRequiredPieceIds()}
        equipmentsById={equipmentsById}
      />
    </React.Fragment>;
  };

  const onRequestDisplayStageOnly = ()=>{
    setSolution({
      mode: ResultDisplayMode.ListStageOnly,
      linearProgrammingSolution: null,
    });
  };

  return <React.Fragment>
    <Head>
      <meta name="description" content={t('meta.description')} key="meta.description"/>
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t('SenseiHelper')}/>
      <meta property="og:description" content={t('meta.description')}/>

      <meta property="twitter:title" content={t('SenseiHelper')}/>
      <meta property="twitter:description" content={t('meta.description')}/>
    </Head>
    <CalculationInputCard store={store} equipments={filteredEquipments}
      campaignsById={campaignsById}
      equipmentsById={equipmentsById}
      onSetSolution={onSetSolution}
      onRequestDisplayStageOnly={onRequestDisplayStageOnly}
    />

    {
      buildLinearProgrammingResult()
    }
  </React.Fragment>;
});

export default Home;
