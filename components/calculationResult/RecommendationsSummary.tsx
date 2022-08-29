import styles from './RecommendationsSummary.module.scss';
import {Card, CardContent} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ResultIsEstimation from 'components/calculationResult/explanation/ResultIsEstimation';
import {useTranslation} from 'next-i18next';

const punchedHoleWidthPx = 150;

const RecommendationsSummary = () => {
  const {t} = useTranslation('home');
  const punchedHoleNumbers = Math.ceil( window.innerWidth / punchedHoleWidthPx);
  const [isResultIsEstimationOpened, setResultIsEstimation] = useState(false);

  const handleResultIsEstimationOpen = () =>{
    setResultIsEstimation(true);
  };

  const handleResultIsEstimationClose = () =>{
    setResultIsEstimation(false);
  };
  return <div>
    <Card className={styles.thinsToNoteCard}>
      <CardContent>
        <div className={styles.punchedHoleContainer} aria-hidden>
          {Array.from(Array(punchedHoleNumbers).keys())
              .map((key) => <div key={key} className={styles.punchedHole} />)}
        </div>

        <BuiLinedText>
          <div>{t('thinsToNote.title')}</div>
        </BuiLinedText>

        <BuiLinedText showVerticalDividerPrefix={false}>
          <div>{t('thinsToNote.pointThisIsEstimation')}
            <IconButton onClick={handleResultIsEstimationOpen}><InfoOutlinedIcon /></IconButton></div>
        </BuiLinedText>
      </CardContent>
    </Card>

    <ResultIsEstimation isOpened={isResultIsEstimationOpened} onClose={handleResultIsEstimationClose}/>
  </div>;
};

export default RecommendationsSummary;
