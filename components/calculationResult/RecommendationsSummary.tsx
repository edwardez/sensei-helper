import styles from './RecommendationsSummary.module.scss';
import {Card, CardContent} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React from 'react';

const punchedHoleWidthPx = 150;

const RecommendationsSummary = () => {
  const punchedHoleNumbers = Math.ceil( window.innerWidth / punchedHoleWidthPx);

  return <div>
    <Card className={styles.thinsToNoteCard}>
      <CardContent>
        <div className={styles.punchedHoleContainer} aria-hidden>
          {Array.from(Array(punchedHoleNumbers).keys())
              .map((key) => <div key={key} className={styles.punchedHole} />)}
        </div>

        <BuiLinedText>
          <div>Things to note</div>
        </BuiLinedText>

        <BuiLinedText showVerticalDividerPrefix={false}>
          <div>1. Recommended sweeping times is an estimation and your mileage may vary.</div>
        </BuiLinedText>
      </CardContent>
    </Card>
  </div>;
};

export default RecommendationsSummary;
