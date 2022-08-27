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
import Grid from '@mui/material/Unstable_Grid2';

type CampaignByRequiredPieceCount = {
    [key: number]: Campaign[],
}

type IgnoredCampaignsProps = {
    solution: Solution<string>,
    allCampaigns: Campaign[],
    allRequiredPieceIds: Set<string>,

};

const sortCampaignsByRequiredPieceCount =
    ({
      solution, allCampaigns, allRequiredPieceIds,
    }: IgnoredCampaignsProps ) => {
      const allNotSkippedStageKeys = new Set(Object.keys(solution));

      // skipped stages are stages that are skipped but contain pieces
      // user requires
      const allSkippedStagesByRequirementCount =
        allCampaigns.reduce<CampaignByRequiredPieceCount>(
            (partialMap, campaign) => {
              if (allNotSkippedStageKeys.has(campaign.id)) return partialMap;
              let requiredPiecesAppearCount = 0;
              for (const reward of campaign.rewards) {
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

const findValidCampaigns = ({solution, allCampaigns, allRequiredPieceIds}: IgnoredCampaignsProps) => {
  const allNotSkippedStageKeys = new Set(Object.keys(solution));

  return allCampaigns.filter((campaign) => {
    if (allNotSkippedStageKeys.has(campaign.id)) return false;
    for (const reward of campaign.rewards) {
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
}: IgnoredCampaignsProps & {equipmentsById: EquipmentsById}) => {
  const skippedValidCampaigns = useMemo(
      () => findValidCampaigns({
        solution: solution,
        allCampaigns: allCampaigns,
        allRequiredPieceIds: allRequiredPieceIds,
      }), [solution,
        allCampaigns,
        allRequiredPieceIds]
  );

  return <Accordion TransitionProps={{unmountOnExit: true, timeout: 0}}
  >
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}>
      <Grid container alignItems={'center'} className={styles.accordionSummaryGrid}>
        <Typography variant={'h6'}>
              Other stages
        </Typography>
        <Typography variant={'body2'} className={styles.accordionSubTitle}>
              Skipped becasue of inefficiency
        </Typography>
      </Grid>
    </AccordionSummary>
    <AccordionDetails>
      {
        skippedValidCampaigns.map((campaign) => {
          const allDrops = campaign.rewards.map(({id}) => ({id, dropCount: 0}));
          return <div className={styles.campaignsWrapper} key={campaign.id}>
            <CampaignDropItemsList
              campaignInfo={campaign} stageExplanationLabel={`Skipped`}
              allDrops={allDrops} equipmentsById={equipmentsById}
              containerCardVariation={'outlined'}
              hidePieceDropCount/>
          </div>;
        })
      }

    </AccordionDetails>
  </Accordion>
  ;
};

export default IgnoredCampaigns;
