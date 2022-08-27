import BuiLinedText from 'components/bui/text/BuiLinedText';
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import React, {ChangeEvent} from 'react';
import {IWizStore} from 'stores/WizStore';
import {observer} from 'mobx-react-lite';

const DropCampaignSelection = ({store, onDropRateChanged} : {store: IWizStore, onDropRateChanged: (value:number)=>void}) => {
  const handleDropRateChange = (event : ChangeEvent<HTMLElement>, value: string) => {
    const number = Number.parseInt(value);
    if (!number) return;

    store.gameInfoStore.changeNormalMissionItemDropRatio(number);
    onDropRateChanged(number);
  };

  return <React.Fragment>
    <BuiLinedText>In a drop campaign?(Mission Normal)</BuiLinedText>

    <RadioGroup row value={`${store.gameInfoStore.normalMissionItemDropRatio}`} onChange={handleDropRateChange}>
      <FormControlLabel value="1" control={<Radio />} label="1x(No Campaign)" />
      <FormControlLabel value="2" control={<Radio />} label="Duoble" />
      <FormControlLabel value="3" control={<Radio />} label="Triple" />
    </RadioGroup>
  </React.Fragment>;
};

export default observer(DropCampaignSelection);
