import styles from './RecommendedCampaigns.module.scss';
import {isString} from 'common/checkVariableTypeUtil';
import React from 'react';
import {
    CampaignsById,
    DropPieceIdsWithCount,
    DropPieceIdWithCount,
    EquipmentsById,
} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {Solution} from 'javascript-lp-solver';
import {IEquipmentsRequirementStore} from 'stores/EquipmentsRequirementStore';
import CampaignDropItemsList from 'components/calculationResult/CampaignDropItemsList';
import {sortTwoUnknownValues} from 'common/sortUtils';


const RecommendedCampaigns = ({
  solution,
  campaignsById,
  equipmentsById,
  equipmentsRequirementStore,
  normalMissionItemDropRatio,
}: {
    solution: Solution<string>,
    campaignsById: CampaignsById,
    equipmentsById: EquipmentsById,
    equipmentsRequirementStore: IEquipmentsRequirementStore,
    normalMissionItemDropRatio: number,
}) => {
  const requiredPieceIds = equipmentsRequirementStore.getAllRequiredPieceIds();
  return <React.Fragment>
    {
      Object.entries(solution)
          .sort(([keyA, valueA], [keyB, valueB]) =>
            sortTwoUnknownValues(valueA, valueB))
          .map(([key, value]) => {
            if (!isString(key) || !value) return null;
            const sweepingTimes = Math.ceil(value);
            const campaignInfo = campaignsById.get(key?.toString() ?? '');

            if (!campaignInfo) return null;

            const {
              requiredItemDrops,
              additionalItemDrops,
            } = campaignInfo.rewards.reduce<DropPieceIdsWithCount>((partiaResult, reward) => {
              let expectedDrop = Math.floor(sweepingTimes * reward.probability );
              expectedDrop = expectedDrop === 0 ? 1 : expectedDrop;
              const dropPieceIdWithCount: DropPieceIdWithCount = {
                id: reward.id,
                dropCount: expectedDrop * normalMissionItemDropRatio,
              };
              if (requiredPieceIds.has(reward.id)) {
                partiaResult.requiredItemDrops.push(dropPieceIdWithCount);
              } else {
                partiaResult.additionalItemDrops.push(dropPieceIdWithCount);
              }
              return partiaResult;
            }, {requiredItemDrops: [], additionalItemDrops: []});
            const allDrops = [...requiredItemDrops, ...additionalItemDrops];

            return <div key={key} className={styles.selectedPiecesCard}>
              <CampaignDropItemsList
                campaignInfo={campaignInfo} stageExplanationLabel={`${sweepingTimes} times`}
                allDrops={allDrops} equipmentsById={equipmentsById} />
            </div>;
          })
    }
  </React.Fragment>;
};


export default RecommendedCampaigns;
