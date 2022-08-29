import styles from './CampaignDropItemsList.module.scss';
import BuiCard from 'components/bui/BuiCard';
import Image from 'next/image';
import {Card, CardContent, Typography} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {Campaign} from 'model/Campaign';
import {DropPieceIdWithProbAndCount, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import BuiBanner from '../bui/BuiBanner';
import {useTranslation} from 'next-i18next';

type CampaignDropItemsListProps = {
    campaignInfo: Campaign,
    stageExplanationLabel: string,
    allDrops: DropPieceIdWithProbAndCount[],
    equipmentsById: EquipmentsById,
    hidePieceDropCount?: boolean,
    containerCardVariation?: 'elevation' | 'outlined',
}

const CampaignDropItemsList :
    FunctionComponent<CampaignDropItemsListProps& React.HTMLAttributes<HTMLDivElement>> = ({
      campaignInfo,
      stageExplanationLabel,
      allDrops,
      equipmentsById,
      hidePieceDropCount= false,
      containerCardVariation = 'elevation',
    }
    ) => {
      const {t} = useTranslation('home');
      return <Card variant={containerCardVariation} className={styles.cardWrapper}
        elevation={containerCardVariation == 'elevation' ? 2 : undefined}>
        <CardContent>
          <Grid container>
            <Grid xs={12} container className={styles.campaignNameAndTimes}>
              <Typography variant={'h4'} className={styles.campaignName}>
                {`${campaignInfo.area}-${campaignInfo.stage}`}
              </Typography>

              <BuiBanner label={stageExplanationLabel} allowSelection
                backgroundColor={'secondary'}
                width={'unset'}/>
            </Grid>

            <Grid xs={12} className={styles.noSelection}>
              <BuiBanner label={t('possibleRewards')}/>
            </Grid>

            <Grid xs={12} className={`${styles.allDropsWrapper} ${styles.noSelection}`} sx={{flexWrap: 'wrap'}}>

              {allDrops.map(({id, dropCount, dropProb}) => {
                const piece = equipmentsById.get(id);

                if (!piece) return null;

                return <BuiCard key={id} elevation={1} className={styles.selectedPiecesCard}>
                  <Image src={`/images/equipments/@0.5/${piece.icon}.png`}
                    width={63} height={50}
                  ></Image>
                  <div className={styles.countOnCard}>
                    {dropCount ? `x${dropCount}` : `${dropProb*100}%`}
                  </div>

                </BuiCard>;
              })}
            </Grid>
          </Grid>
        </CardContent>
      </Card>;
    };

export default CampaignDropItemsList;
