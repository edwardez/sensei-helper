import styles from './RecommendedCampaigns.module.scss';
import {isString} from 'common/checkVariableTypeUtil';
import React, {useEffect, useState} from 'react';
import {
  CampaignsById,
  DropPieceIdsWithCount,
  DropPieceIdWithProbAndCount,
  EquipmentsById,
} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {Solution} from 'javascript-lp-solver';
import {IEquipmentsRequirementStore} from 'stores/EquipmentsRequirementStore';
import CampaignDropItemsList from 'components/calculationResult/CampaignDropItemsList';
import {sortTwoUnknownValues} from 'common/sortUtils';
import {useTranslation} from 'next-i18next';
import {checkIfRequirementInefficient} from 'components/calculationInput/common/InefficientRequirementDetector';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';
import InefficientRequirementWarning from 'components/calculationInput/common/InefficientRequirementWarning';


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
  const {t} = useTranslation('home');
  const store = useStore();
  const requiredPieceIds = equipmentsRequirementStore.getAllRequiredPieceIds();
  const [isInefficientRequirementDialogOpened, setIsInefficientRequirementDialogOpened] = useState(false);

  useEffect(() => {
    if (!solution || !campaignsById) return;

    if (!store.stageCalculationStateStore.requirementInefficacy.hideInefficientRequirementDialog) {
      const isInefficient = checkIfRequirementInefficient(solution, campaignsById);
      setIsInefficientRequirementDialogOpened(isInefficient);
      store.stageCalculationStateStore.setIsInefficientRequirement(store.equipmentsRequirementStore.requirementMode, isInefficient);
    }
  }, [solution, campaignsById]);


  const handleCloseInefficientRequirementDialog = () =>{
    setIsInefficientRequirementDialogOpened(false);
  };

  return <React.Fragment>
    <InefficientRequirementWarning isOpened={isInefficientRequirementDialogOpened}
      onCloseDialog={handleCloseInefficientRequirementDialog}/>
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
              const dropPieceIdWithCount: DropPieceIdWithProbAndCount = {
                id: reward.id,
                dropCount: expectedDrop * normalMissionItemDropRatio,
                dropProb: normalMissionItemDropRatio,
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
                campaignInfo={campaignInfo} stageExplanationLabel={t('stageSweepingTimes', {sweepingTimes})}
                allDrops={allDrops} equipmentsById={equipmentsById} />
            </div>;
          })
    }
  </React.Fragment>;
};


export default observer(RecommendedCampaigns);
