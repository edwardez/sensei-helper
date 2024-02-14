import styles from './AllPotentialStages.module.scss';
import React, {useMemo} from 'react';
import {useStore} from 'stores/WizStore';
import {Campaign} from 'model/Campaign';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';
import {
  listAndSortPotentialCampaigns,
} from 'components/calculationInput/listStagesResult/listAndSortPotentialCampaigns';
import CampaignDropItemsList from 'components/calculationResult/CampaignDropItemsList';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {useTranslation} from 'next-i18next';
import Box from '@mui/material/Box';

const AllPotentialStages = ({
  campaigns, piecesState, equipmentsById,
}: {
  campaigns: Campaign[],
  equipmentsById: EquipmentsById,
  piecesState:Map<string, PieceState>,
}) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const allPotentialCampaigns = useMemo(
      () => listAndSortPotentialCampaigns(store.equipmentsRequirementStore.requirementMode, campaigns, piecesState,
          store.equipmentsRequirementStore.getAllRequiredPieceIds(),
          store.gameInfoStore.gameServer,
      ), [campaigns, piecesState, store.equipmentsRequirementStore.requirementMode]
  );

  return <Box sx={{mt: 3}} className={styles.allStages}>
    {
      allPotentialCampaigns.map((campaign) => {
        const allDrops = campaign.potentialTargetRewards.map(({id, probability}) => ({id, dropProb: probability}));
        return <Box sx={{mt: 3}} key={campaign.id}>
          <CampaignDropItemsList
            campaignInfo={campaign} stageExplanationLabel={t('resultPiecesCountOnStage', {count: campaign?.targetRewardIds?.size})}
            allDrops={allDrops} equipmentsById={equipmentsById}
            shouldHighLightPiece={(id) => campaign.targetRewardIds.has(id)}
            hidePieceDropCount
            piecesState={piecesState} />
        </Box>;
      })
    }
  </Box>;
};

export default AllPotentialStages;
