import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React, {ChangeEvent} from 'react';
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import {RequirementMode} from 'stores/EquipmentsRequirementStore';
import {useTranslation} from 'next-i18next';

type RequirementModeSelectionProps = {
  store: IWizStore,
  onModeChange: (mode:RequirementMode) => void,
}

const RequirementModeSelection = ({store, onModeChange}: RequirementModeSelectionProps) => {
  const {t} = useTranslation('home');

  const handleModeChange = (event : ChangeEvent<HTMLElement>, value: string) =>{
    const mode = RequirementMode[value as keyof typeof RequirementMode];
    store.equipmentsRequirementStore.updateRequirementMode(mode);
    onModeChange(mode);
  };

  return <div>
    <BuiLinedText>{t('selectInputMode')}</BuiLinedText>

    <RadioGroup row value={`${store.equipmentsRequirementStore.requirementMode}`} onChange={handleModeChange}>
      <FormControlLabel value={RequirementMode.ByEquipment} control={<Radio />} label={t('inputByEquipment')} />
      <FormControlLabel value={RequirementMode.ByPiece} control={<Radio />} label={t('inputByPiece')} />
    </RadioGroup>
  </div>;
};

export default observer(RequirementModeSelection);
