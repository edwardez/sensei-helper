import styles from './CampaignDropItemsList.module.scss';
import BuiCard from 'components/bui/BuiCard';
import Image from 'next/image';
import {Card, Typography} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {Campaign} from 'model/Campaign';
import {DropPieceIdWithCount, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import BuiBanner from '../bui/BuiBanner';

type CampaignDropItemsListProps = { campaignInfo: Campaign,
  sweepingTimes: number,
  allDrops: DropPieceIdWithCount[],
  equipmentsById: EquipmentsById,}

const CampaignDropItemsList :
    FunctionComponent<CampaignDropItemsListProps& React.HTMLAttributes<HTMLDivElement>> = ({
      campaignInfo,
      sweepingTimes,
      allDrops,
      equipmentsById,
    }
    ) => {
      return <Card className={styles.cardWrapper} elevation={2}>
        <Grid container>
          <Grid xs={12} container className={styles.campaignNameAndTimes}>
            <Typography variant={'h4'} className={styles.campaignName}>
              {`${campaignInfo.area}-${campaignInfo.stage}`}
            </Typography>

            <BuiBanner label={`${sweepingTimes} times`}
              backgroundColor={'secondary'}
              width={'unset'}/>
          </Grid>

          <Grid xs={12} >
            <BuiBanner label={`Possible rewards`}/>
          </Grid>

          <Grid xs={12} className={styles.allDropsWrapper} sx={{flexWrap: 'wrap'}}>

            {allDrops.map(({id, dropCount}) => {
              const piece = equipmentsById.get(id);

              if (!piece) return null;

              return <BuiCard key={id} elevation={1} className={styles.selectedPiecesCard}>
                <Image src={`/images/equipments/${piece.icon}.png`}
                  width={63} height={50}
                ></Image>
                <div className={styles.countOnCard}>
                        x{dropCount}
                </div>
              </BuiCard>;
            })}
          </Grid>
        </Grid>
      </Card>;
    };

export default CampaignDropItemsList;
