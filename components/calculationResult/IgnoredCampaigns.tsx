import styles from './IgnoredCampaigns.module.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Solution} from 'javascript-lp-solver';
import {EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import {Campaign} from 'model/Campaign';
import {sortTwoUnknownValues} from 'common/sortUtils';
import React, {useMemo} from 'react';
import CampaignDropItemsList from 'components/calculationResult/CampaignDropItemsList';
import Box from '@mui/material/Box';
import {useTranslation} from 'next-i18next';
import {getRewardsByRegion} from 'common/gameDataHandlerUtil';
import {GameServer} from 'model/Equipment';
import {PieceState} from 'components/calculationInput/equipments/inventory/PiecesInventory';

type CampaignByRequiredPieceCount = {
    [key: number]: Campaign[],
}

type IgnoredCampaignsProps = {
    solution: Solution<string>,
    allCampaigns: Campaign[],
    allRequiredPieceIds: Set<string>,
    gameServer: GameServer,
};

const sortCampaignsByRequiredPieceCount =
    ({
      solution, allCampaigns, allRequiredPieceIds, gameServer,
    }: IgnoredCampaignsProps ) => {
      const allNotSkippedStageKeys = new Set(Object.keys(solution));

      // skipped stages are stages that are skipped but contain pieces
      // user requires
      const allSkippedStagesByRequirementCount =
        allCampaigns.reduce<CampaignByRequiredPieceCount>(
            (partialMap, campaign) => {
              if (allNotSkippedStageKeys.has(campaign.id)) return partialMap;
              let requiredPiecesAppearCount = 0;
              for (const reward of getRewardsByRegion(campaign, gameServer)) {
                if (allRequiredPieceIds.has(reward.id)) {
                  requiredPiecesAppearCount++;
                }
              }
              if (requiredPiecesAppearCount === 0) return partialMap;

              if (!partialMap[requiredPiecesAppearCount]) {
                partialMap[requiredPiecesAppearCount] = [];
              }
              partialMap[requiredPiecesAppearCount].push(campaign);
              return partialMap;
            }, {}
        );
      return Object.keys(allSkippedStagesByRequirementCount).reverse()
          .map((count) => allSkippedStagesByRequirementCount[parseInt(count)])
          .flatMap((stages) => stages);
    };

const findValidCampaigns = ({solution, allCampaigns, allRequiredPieceIds, gameServer}: IgnoredCampaignsProps) => {
  const allNotSkippedStageKeys = new Set(Object.keys(solution));

  return allCampaigns.filter((campaign) => {
    if (allNotSkippedStageKeys.has(campaign.id)) return false;
    for (const reward of getRewardsByRegion(campaign, gameServer)) {
      if (allRequiredPieceIds.has(reward.id)) return true;
    }

    return false;
  }, {})
      .sort(({area: areaA}, {area: areaB}) =>
        sortTwoUnknownValues(areaA, areaB));
};

const IgnoredCampaigns = ({
  solution,
  allCampaigns,
  allRequiredPieceIds,
  equipmentsById,
  gameServer,
  piecesState,
}: IgnoredCampaignsProps & {
  equipmentsById: EquipmentsById,
  piecesState: Map<string, PieceState>,
}) => {
  const {t} = useTranslation('home');

  const skippedValidCampaigns = useMemo(
      () => findValidCampaigns({
        solution: solution,
        allCampaigns: allCampaigns,
        allRequiredPieceIds: allRequiredPieceIds,
        gameServer,
      }), [solution,
        allCampaigns,
        allRequiredPieceIds]
  );

  if (!skippedValidCampaigns?.length) return null;
  return <Accordion TransitionProps={{unmountOnExit: true, timeout: 0}}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}>
      <Box display={'flex'} alignItems={'center'} flexGrow={1} className={styles.accordionSummaryGrid}>
        <Box>
          <Typography variant={'h6'}>
            {t('otherStages')}
          </Typography>
        </Box>
        <Box flexGrow={1}>
        </Box>
        <Box>
          <Typography variant={'body2'} className={styles.accordionSubTitle}>
            {t('otherStagesSkippedReason')}
          </Typography>
        </Box>

      </Box>
    </AccordionSummary>
    <AccordionDetails>
      {
        skippedValidCampaigns.map((campaign) => {
          const allDrops = getRewardsByRegion(campaign, gameServer).map(({id, probability}) => ({id, dropProb: probability}));
          return <div className={styles.campaignsWrapper} key={campaign.id}>
            <CampaignDropItemsList
              campaignInfo={campaign} stageExplanationLabel={t('stageIsSkipped')}
              allDrops={allDrops} equipmentsById={equipmentsById}
              containerCardVariation={'outlined'}
              hidePieceDropCount
              piecesState={piecesState}/>
          </div>;
        })
      }

    </AccordionDetails>
  </Accordion>
  ;
};

export default IgnoredCampaigns;
