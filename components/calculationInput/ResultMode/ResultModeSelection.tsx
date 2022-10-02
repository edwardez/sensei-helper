import {useTranslation} from 'next-i18next';
import {useStore} from 'stores/WizStore';
import React, {ChangeEvent} from 'react';
import {ResultMode} from 'stores/EquipmentsRequirementStore';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import {observer} from 'mobx-react-lite';

const ResultModeSelection = () => {
  const {t} = useTranslation('home');
  const store = useStore();

  const handleModeChange = (event : ChangeEvent<HTMLElement>, value: string) =>{
    const mode = ResultMode[value as keyof typeof ResultMode];
    store.equipmentsRequirementStore.updateResultMode(mode);
  };

  return <div>
    <BuiLinedText>{t('selectResultMode')}</BuiLinedText>

    <RadioGroup row value={`${store.equipmentsRequirementStore.resultMode}`} onChange={handleModeChange}>
      <FormControlLabel value={ResultMode.LinearProgrammingCalculation} control={<Radio />} label={t('resultLinearProgramming')} />
      <FormControlLabel value={ResultMode.ListStagesOnly} control={<Radio />} label={t('resultListStagesOnly')} />
    </RadioGroup>
  </div>;
};

export default observer(ResultModeSelection);
