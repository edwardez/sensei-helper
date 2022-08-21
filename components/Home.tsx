import type {NextPage} from 'next';
import styles from './Home.module.scss';
import * as solver from 'javascript-lp-solver';
import {IModelVariableConstraint, Solution} from 'javascript-lp-solver';

import React, {useMemo, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button, Divider} from '@mui/material';
import {IBasStore, useStore} from 'stores/AppStore';
import PiecesSelectionDialog from 'components/piecesSelection/PiecesSelectionDialog';
import {IRequirementByPiece} from 'stores/EquipmentsRequirementStore';
import {Equipment, EquipmentCompositionType} from 'model/Equipment';
import Image from 'next/image';
import {useQuery} from '@tanstack/react-query';
import {Simulate} from 'react-dom/test-utils';
import {Campaign} from 'model/Campaign';

// import {Equipment, EquipmentCompositionType} from 'stores/GameDataStore';

interface IOwnProps {
  store?: IBasStore
  title: string
  linkTo: string
}

type PieceDropProb = {[key:string]: number};
type PiecesDropProbByCampaignId = Map<string, PieceDropProb[]>;

const calc = (requirements: IRequirementByPiece[], piecesDropByCampaignId: Map<string, Campaign>) => {
  const constraints = requirements.reduce<{[key: string]: IModelVariableConstraint}>(
      (partialConstraints, requirement) => {
        partialConstraints[requirement.pieceId] = {'min': requirement.count};
        return partialConstraints;
      }
      , {});

  const requiredPieceIds = new Set(Object.keys(constraints));
  const variables : { [key:string] : PieceDropProb} = {};
  piecesDropByCampaignId.forEach(( campaign, campaignId) =>{
    const filteredProbs = campaign.rewards
        .filter((reward) => requiredPieceIds.has(reward.id))
        .reduce<PieceDropProb>((prev, reward) => {
          prev[reward.id] = reward.probability;
          return prev;
        }, {});
    if (Object.keys(filteredProbs).length) {
      filteredProbs['ap'] = 10;
      variables[campaignId] = filteredProbs;
    }
  });

  constraints['ap'] = {'min': 0};
  const model = {
    'optimize': 'ap',
    'opType': 'min' as const,
    constraints,
    variables};

  // eslint-disable-next-line new-cap
  return solver.Solve(model);
};

const Home: NextPage = observer((props) => {
  const store = useStore();

  const [isOpened, setIsOpened] = useState(false);
  const [solution, setSolution] = useState<Solution<string>|null>(null);

  const handleClickOpen = () => {
    setIsOpened(true);
  };

  const handleAddPieceRequirement = (requirementByPiece: IRequirementByPiece) => {
    store.equipmentsRequirementStore.addPiecesRequirement(requirementByPiece);
    setIsOpened(false);
    setSolution(null);
  };

  const handleCancel = () => {
    setIsOpened(false);
  };

  const fetchOne = async <ReturnedDataType, >(url: string) => {
    const res = await fetch(url);
    return (await res.json()) as ReturnedDataType;
  };
  const campaignsQuery = useQuery(['campaigns'], () => fetchOne<Campaign[]>('data/campaigns.json'),
      {placeholderData: []});
  const equipmentsQuery = useQuery(['equipments'], () => fetchOne<Equipment[]>('data/equipments.json'),
      {placeholderData: []});
  const campaigns = campaignsQuery.data ?? [];
  const equipments = equipmentsQuery.data ?? [];

  const equipmentsById : Map<string, Equipment> = useMemo(() => equipments?.reduce((prev,
      current) => prev.set(current.id, current), new Map()), [equipments]);

  const piecesByTier : Map<number, Equipment[]>= useMemo(() => equipments?.reduce((map, equipment) => {
    if (equipment.equipmentCompositionType !== EquipmentCompositionType.Piece) return map;
    if (!map.has(equipment.tier)) {
      map.set(equipment.tier, []);
    }
    map.get(equipment.tier).push(equipment);
    return map;
  }, new Map()), [equipments]);

  const campaignsById : Map<string, Campaign>= useMemo(() => campaigns?.reduce((map,
      campaign) => map.set(campaign.id, campaign), new Map()), [campaigns]);
  if (campaignsQuery.error || equipmentsQuery.error) return <div>failed to load</div>;
  if (campaignsQuery.isFetching || equipmentsQuery.isFetching) return <div>loading...</div>;


  const handleCalculate = () => {
    setSolution(calc(store.equipmentsRequirementStore.requirementByPieces, campaignsById));
  };

  return (
    <div className={styles.container}>

      <div></div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add
      </Button>
      <div>
        {store.equipmentsRequirementStore.requirementByPieces.map(({pieceId: id, count}) => {
          const piece = equipmentsById.get(id);

          if (!piece) return null;

          return <div key={id}>
            <Image src={`/images/equipments/${piece.icon}.png`}
              width={63} height={50}
            ></Image> x {count}
          </div>;
        })}
      </div>

      {
        isOpened ? <PiecesSelectionDialog
          isOpened={isOpened}

          piecesByTier={piecesByTier}
          handleAddPieceRequirement={handleAddPieceRequirement}
          handleCancel={handleCancel}
        /> : <></>
      }

      <Divider />
      <Button variant="outlined" onClick={handleCalculate}>
        Calculate
      </Button>

      <div>{solution ? JSON.stringify(solution) : null}</div>
    </div>
  );
});

export default Home;
