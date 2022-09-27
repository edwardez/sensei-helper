import styles from './TargetEquipmentSelection.module.scss';
import Box from '@mui/material/Box';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import BuiButton from 'components/bui/BuiButton';
import {Equipment} from 'model/Equipment';
import {useState} from 'react';
import EquipmentCard from 'components/bui/card/EquipmentCard';

const TargetEquipmentSelection = (
    {
      baseEquipment,
      onEquipmentChanged,
      availableTargetEquipments,
    }: {
      baseEquipment: Equipment,
      availableTargetEquipments: Equipment[],
      onEquipmentChanged: (equip: Equipment) => void,
    }
) => {
  const minReachableTier = baseEquipment.tier+1;
  const equipments = availableTargetEquipments;
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(equipments[0]);
  const maxTierForCurrentCategory = equipments[equipments.length-1].tier;
  const onMinusOneEquipment = () =>{
    const newEquipment = equipments[equipments.indexOf(currentEquipment) - 1];
    if (!newEquipment) return;
    setCurrentEquipment(newEquipment);
    onEquipmentChanged(newEquipment);
  };
  const onPlusOneEquipment = () =>{
    const newEquipment = equipments[equipments.indexOf(currentEquipment) + 1];
    if (!newEquipment) return;
    setCurrentEquipment(newEquipment);
    onEquipmentChanged(newEquipment);
  };
  const onSetToMaxTierEquipment = () =>{
    const newEquipment = equipments[equipments.length-1];
    if (!newEquipment) return;
    setCurrentEquipment(newEquipment);
    onEquipmentChanged(newEquipment);
  };

  return <Box sx={{display: 'flex', mb: 3}} className={styles.selectionWrapper}>
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier <= minReachableTier}
      size="large" color={'baButtonLightBackgroundPrimary'} onClick={onMinusOneEquipment}>
      <ArrowBackIosRoundedIcon />
    </BuiButton>
    <EquipmentCard imageName={currentEquipment.icon} />
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier >= maxTierForCurrentCategory}
      size="large" color={'baButtonLightBackgroundPrimary'} onClick={onPlusOneEquipment}>
      <ArrowForwardIosRoundedIcon />
    </BuiButton>
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier >= maxTierForCurrentCategory}
      color={'baButtonSecondary'} onClick={onSetToMaxTierEquipment}>
      Max
    </BuiButton>
  </Box>;
};

export default TargetEquipmentSelection;
