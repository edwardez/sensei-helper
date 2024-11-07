import type {NextPage} from 'next';
import {Solution} from 'javascript-lp-solver';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';

import {Campaign} from 'model/Campaign';
import RecommendedCampaigns from 'components/calculationResult/RecommendedCampaigns';
import CalculationInputCard from 'components/calculationInput/CalculationInputCard';
import {CampaignsById, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import useSWR from 'swr';
import RecommendationsSummary from 'components/calculationResult/RecommendationsSummary';
import IgnoredCampaigns from 'components/calculationResult/IgnoredCampaigns';
import Head from 'next/head';
import {useTranslation} from 'next-i18next';
import {RequirementMode, ResultMode} from 'stores/EquipmentsRequirementStore';
import AllPotentialStages from 'components/calculationInput/listStagesResult/AllPotentialStages';
import {onSnapshot} from 'mobx-state-tree';
import {
  EquipmentsByTierAndCategory,
  hashTierAndCategoryKey,
} from 'components/calculationInput/equipments/EquipmentsInput';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {calculatePiecesState} from 'components/calculationInput/equipments/inventory/piecesStateCalculator';

const Home: NextPage = observer((props) => {
  const store = useStore();
  const {t} = useTranslation('home');
  const [solution, setSolution] = useState<Solution<string> | ResultMode.ListStages | null >(null);

  const onSetSolution = (solution: Solution<string> | null) => {
    setSolution(solution);
  };
  // A "hash state" that generates a unique value each time equip store changes.
  // This is a hack for that useMemo cannot track changes in store objects
  // Instead of deep-comparing all store objects we listen to store change using onSnapshot
  // then tracks its state hash here.
  const equipStoreStateRef = useRef(1);


  const fetcher = (urls: string[]) => {
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
    setSolution(null);
    const gameServer = store.gameInfoStore.gameServer;
    return allEquipments.filter((equipment) => equipment.releasedIn.includes(gameServer));
  }, [store.gameInfoStore.gameServer, allEquipments]);
  const campaigns = data?.[1] as Campaign[];

  const equipmentsById = useMemo(() => filteredEquipments?.reduce<EquipmentsById>((prev,
      current) => prev.set(current.id, current), new Map()), [filteredEquipments]);
  const campaignsById = useMemo(() => campaigns?.reduce<CampaignsById>((map,
      campaign) => map.set(campaign.id, campaign), new Map()), [campaigns]);

  if (error) return <div>failed to load</div>;

  useEffect(() => {
    // Updates euipstore "hash" on each time requirement gets updated
    const dispose = onSnapshot(store.equipmentsRequirementStore, (snapShot) => {
      onSetSolution(null);
      if (snapShot.requirementMode !== RequirementMode.ByEquipment) return;
      equipStoreStateRef.current += 1;
    });

    return () => dispose();
  }, []);
  const equipmentsByTierAndCategory: EquipmentsByTierAndCategory = useMemo(() => {
    const mapBuilder: EquipmentsByTierAndCategory = new Map();
    if (!equipmentsById) return mapBuilder;
    equipmentsById.forEach((equipment, id) => {
      if (equipment.equipmentCompositionType !== EquipmentCompositionType.Composite) {
        return;
      }
      mapBuilder.set(
          hashTierAndCategoryKey({
            tier: equipment.tier,
            category: equipment.category,
          }), equipment
      );
    });

    return mapBuilder;
  }, [equipmentsById]);

  const piecesState: Map<string, PieceState> = useMemo(()=>{
    return calculatePiecesState(store, equipmentsById, equipmentsByTierAndCategory);
  }, [equipmentsByTierAndCategory, equipmentsById, equipStoreStateRef?.current]);

  const handleCloseInEfficacyDialog = (isExcludeInefficientStagesDirty: boolean)=>{
    if (!isExcludeInefficientStagesDirty) return;
    onSetSolution(null);
  };
  const buildListStageOnlyResult = () => {
    if (solution !== ResultMode.ListStages) return null;

    return <AllPotentialStages campaigns={campaigns}
      equipmentsById={equipmentsById}
      piecesState={piecesState}/>;
  };

  const buildLinearProgrammingSolution = () =>{
    if (solution === ResultMode.ListStages|| !solution?.result) return null;

    return <React.Fragment>
      <RecommendationsSummary onCloseInEfficacyDialog={handleCloseInEfficacyDialog}/>
      <RecommendedCampaigns
        solution={solution}
        campaignsById={campaignsById}
        equipmentsById={equipmentsById}
        equipmentsRequirementStore={store.equipmentsRequirementStore}
        normalMissionItemDropRatio={store.gameInfoStore.normalMissionItemDropRatio}
        onCloseInEfficacyDialog={handleCloseInEfficacyDialog}/>
      <IgnoredCampaigns
        solution={solution}
        allCampaigns={campaigns}
        allRequiredPieceIds={store.equipmentsRequirementStore.getAllRequiredPieceIds()}
        equipmentsById={equipmentsById}
        gameServer={store.gameInfoStore.gameServer}
      />
    </React.Fragment>;
  };

  return <>
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
      piecesState={piecesState}
      equipmentsByTierAndCategory={equipmentsByTierAndCategory}
      onSetSolution={onSetSolution}
    />

    {
      store.equipmentsRequirementStore.resultMode === ResultMode.LinearProgram ?
          buildLinearProgrammingSolution() : buildListStageOnlyResult()
    }
  </>;
});

export default Home;
