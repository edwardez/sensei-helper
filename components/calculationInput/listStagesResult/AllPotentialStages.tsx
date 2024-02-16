import styles from './AllPotentialStages.module.scss';
import React, {useCallback, useMemo} from 'react';
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
import {equipmentCategories} from '../equipments/EquipmentFilterChips';
import {getRewardsByRegion} from 'common/gameDataHandlerUtil';
import {useFilterChips} from '../common/FilterChips';

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

  const filterSpec = useMemo(() => {
    const categorySpec = equipmentCategories
        .map((key) => ({key, label: t(`equipmentCategory.${key}`)}));
    return {reward: categorySpec};
  }, [t]);
  const [selection,, filterChips] = useFilterChips(filterSpec);
  const filterFunc = useCallback((campaign: Campaign) => {
    const isNully = (x: unknown) => x === null || x === undefined;
    const rewards = campaign && getRewardsByRegion(campaign, store.gameInfoStore.gameServer);
    return isNully(selection?.reward) ||
          rewards?.some(({id}) => equipmentsById.get(id)?.category === selection?.reward);
  }, [equipmentsById, selection, store.gameInfoStore.gameServer]);

  return <Box sx={{mt: 3}} className={styles.allStages}>
    {filterChips}
    {
      allPotentialCampaigns.filter(filterFunc).map((campaign) => {
        const allDrops = campaign.potentialTargetRewards.map(({id, probability}) => ({id, dropProb: probability}));
        return <Box sx={{mt: 3}} key={campaign.id}>
          <CampaignDropItemsList
            campaignInfo={campaign} stageExplanationLabel={t('resultPiecesCountOnStage', {count: campaign?.targetRewardIds?.size})}
            allDrops={allDrops} equipmentsById={equipmentsById}
            shouldHighLightPiece={(id) => campaign.targetRewardIds.has(id)}
            hidePieceDropCount/>
        </Box>;
      })
    }
  </Box>;
};

export default AllPotentialStages;
