import {observer} from 'mobx-react-lite';
import {IWizStore} from 'stores/WizStore';
import BuiLinedText from 'components/bui/text/BuiLinedText';
import React, {ChangeEvent} from 'react';
import {FormControlLabel, Radio, RadioGroup} from '@mui/material';
import {RequirementMode} from 'stores/EquipmentsRequirementStore';

type RequirementModeSelectionProps = {
  store: IWizStore,
  onModeChange: (mode:RequirementMode) => void,
}

const RequirementModeSelection = ({store, onModeChange}: RequirementModeSelectionProps) => {
  const handleModeChange = (event : ChangeEvent<HTMLElement>, value: string) =>{
    const mode = RequirementMode[value as keyof typeof RequirementMode];
    store.equipmentsRequirementStore.updateRequirementMode(mode);
    onModeChange(mode);
  };

  return <div>
    <BuiLinedText>Select input mode</BuiLinedText>

    <RadioGroup row value={`${store.equipmentsRequirementStore.requirementMode}`} onChange={handleModeChange}>
      <FormControlLabel value={RequirementMode.ByEquipment} control={<Radio />} label={'By Equipment'} />
      <FormControlLabel value={RequirementMode.ByPiece} control={<Radio />} label={'By Piece'} />
    </RadioGroup>
  </div>;
};

export default observer(RequirementModeSelection);
