import styles from './CampaignDropItemsList.module.scss';
import {Card, CardContent, Typography} from '@mui/material';
import React, {FunctionComponent} from 'react';
import {Campaign} from 'model/Campaign';
import {DropPieceIdWithProbAndCount, EquipmentsById} from 'components/calculationInput/PiecesCalculationCommonTypes';
import Grid from '@mui/material/Unstable_Grid2';
import BuiBanner from '../bui/BuiBanner';
import {useTranslation} from 'next-i18next';
import EquipmentCard from 'components/bui/card/EquipmentCard';

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
              <Typography variant={'h4'}>
                {`${campaignInfo.area}-${campaignInfo.stage}`}
              </Typography>

              <BuiBanner label={stageExplanationLabel} allowSelection
                sx={{marginLeft: '0.8em'}}
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
                const bottomText = dropCount ? `x${dropCount}` : `${dropProb*100}%`;
                return <EquipmentCard key={piece.id} hasOuterMargin
                  imageName={piece.icon}
                  bottomText={bottomText}/>;
              })}
            </Grid>
          </Grid>
        </CardContent>
      </Card>;
    };

export default CampaignDropItemsList;
