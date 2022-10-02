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
  store.equipmentsRequirementStore.getAllRequiredPieceIds();
  store.equipmentsRequirementStore.requirementByEquipments;
  const allPotentialCampaigns = useMemo(
      () => listAndSortPotentialCampaigns(campaigns, piecesState), [campaigns, piecesState]
  );

  return <Box sx={{mt: 3}} className={styles.allStages}>
    {
      allPotentialCampaigns.map((campaign) => {
        const allDrops = campaign.rewards.map(({id, probability}) => ({id, dropProb: probability}));
        return <Box sx={{mt: 3}} key={campaign.id}>
          <CampaignDropItemsList
            campaignInfo={campaign} stageExplanationLabel={t('resultPiecesCountOnStage', {count: campaign?.targetRewards?.length})}
            allDrops={allDrops} equipmentsById={equipmentsById}
            shouldHighLightPiece={(id) => piecesState.has(id)}
            hidePieceDropCount/>
        </Box>;
      })
    }
  </Box>;
};

export default AllPotentialStages;
