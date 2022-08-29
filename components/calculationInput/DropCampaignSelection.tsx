import BuiLinedText from 'components/bui/text/BuiLinedText';
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import React, {ChangeEvent} from 'react';
import {IWizStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'next-i18next';

const DropCampaignSelection = ({store, onDropRateChanged} : {store: IWizStore, onDropRateChanged: (value:number)=>void}) => {
  const {t} = useTranslation('home');
  const handleDropRateChange = (event : ChangeEvent<HTMLElement>, value: string) => {
    const number = Number.parseInt(value);
    if (!number) return;

    store.gameInfoStore.changeNormalMissionItemDropRatio(number);
    onDropRateChanged(number);
  };

  return <React.Fragment>
    <BuiLinedText>{t('isInADropCampaign')}</BuiLinedText>

    <RadioGroup row value={`${store.gameInfoStore.normalMissionItemDropRatio}`} onChange={handleDropRateChange}>
      <FormControlLabel value="1" control={<Radio />} label={t('normal1x')} />
      <FormControlLabel value="2" control={<Radio />} label={t('normal2x')} />
      <FormControlLabel value="3" control={<Radio />} label={t('normal3x')} />
    </RadioGroup>
  </React.Fragment>;
};

export default observer(DropCampaignSelection);
