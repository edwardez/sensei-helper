import styles from './RecommendationsSummary.module.scss';
import {Card, CardContent} from '@mui/material';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React, {useState} from 'react';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ResultIsEstimation from 'components/calculationResult/explanation/ResultIsEstimation';
import {useTranslation} from 'next-i18next';
import variables from 'scss/variables.module.scss';
import InefficientRequirementWarning, {
  OnCloseInefficacyDialog,
} from 'components/calculationInput/common/InefficientRequirementWarning';
import {observer} from 'mobx-react-lite';
import {useStore} from 'stores/WizStore';

const punchedHoleWidthPx = 150;

const RecommendationsSummary = (
    {
      onCloseInEfficacyDialog,
    }: {
      onCloseInEfficacyDialog: OnCloseInefficacyDialog,
    }
) => {
  const {t} = useTranslation('home');
  const store = useStore();
  const punchedHoleNumbers = Math.ceil( window.innerWidth / punchedHoleWidthPx);
  const [isResultIsEstimationOpened, setResultIsEstimation] = useState(false);
  const [isInefficientRequirementOpened, setIsInefficientRequirementOpened] = useState(false);

  const handleResultIsEstimationOpen = () =>{
    setResultIsEstimation(true);
  };

  const handleResultIsEstimationClose = () =>{
    setResultIsEstimation(false);
  };

  const buildInefficacyWarning = () => {
    const isRequirementInEfficient = store.stageCalculationStateStore.getRequirementInEfficacy(store.equipmentsRequirementStore.requirementMode);
    const excludeInefficientStages = store.stageCalculationStateStore.requirementInefficacy.excludeInefficientStages;
    if (excludeInefficientStages) return null;
    if (!isRequirementInEfficient) return null;

    return <BuiLinedText showVerticalDividerPrefix={false}>
      <div>
        {t('thinsToNote.recommendUpdatingRequirement')}
        <IconButton size={'small'} sx={{color: variables.baPrimaryTextColor}}
          onClick={() => setIsInefficientRequirementOpened(true)}><InfoOutlinedIcon /></IconButton>
      </div>
    </BuiLinedText>;
  };

  const buildStagesSkippedNotification = () =>{
    const excludeInefficientStages = store.stageCalculationStateStore.requirementInefficacy.excludeInefficientStages;
    if (!excludeInefficientStages) return null;

    return <BuiLinedText showVerticalDividerPrefix={false}>
      <div>
        {t('thinsToNote.inefficientStagesIgnored')}
        <IconButton size={'small'} sx={{color: variables.baPrimaryTextColor}}
          onClick={() => setIsInefficientRequirementOpened(true)}><InfoOutlinedIcon /></IconButton>
      </div>
    </BuiLinedText>;
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
            <IconButton size={'small'} sx={{color: variables.baPrimaryTextColor}} onClick={handleResultIsEstimationOpen}><InfoOutlinedIcon /></IconButton></div>
        </BuiLinedText>

        {buildInefficacyWarning()}
        {buildStagesSkippedNotification()}

      </CardContent>
    </Card>

    <ResultIsEstimation isOpened={isResultIsEstimationOpened} onClose={handleResultIsEstimationClose}/>
    <InefficientRequirementWarning
      isOpened={isInefficientRequirementOpened}
      onCloseDialog={(isExcludeInefficientStagesDirty: boolean) => {
        setIsInefficientRequirementOpened(false);
        onCloseInEfficacyDialog(isExcludeInefficientStagesDirty);
      }
      }/>
  </div>;
};

export default observer(RecommendationsSummary);
