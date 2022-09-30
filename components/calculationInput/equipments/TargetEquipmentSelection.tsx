import styles from './TargetEquipmentSelection.module.scss';
import Box from '@mui/material/Box';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import BuiButton from 'components/bui/BuiButton';
import {Equipment} from 'model/Equipment';
import {useEffect, useState} from 'react';
import EquipmentCard from 'components/bui/card/EquipmentCard';
import {useTranslation} from 'next-i18next';

const TargetEquipmentSelection = (
    {
      baseEquipment,
      targetEquipment,
      onEquipmentChanged,
      availableTargetEquipments,
    }: {
      baseEquipment: Equipment,
      targetEquipment?: Equipment,
      availableTargetEquipments: Equipment[],
      onEquipmentChanged: (equip: Equipment) => void,
    }
) => {
  const {t} = useTranslation('home');

  const minReachableTier = baseEquipment.tier+1;
  const equipments = availableTargetEquipments;
  const [currentEquipment, setCurrentEquipment] = useState<Equipment>(equipments[0]);

  useEffect(() => {
    if (!targetEquipment) return;

    setCurrentEquipment(targetEquipment);
  }, [targetEquipment]);
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

  return <Box sx={{display: 'flex', flexWrap: 'wrap', mb: 3}} className={styles.selectionWrapper}>
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier <= minReachableTier}
      size="large" color={'baButtonLightBackgroundPrimary'} onClick={onMinusOneEquipment}>
      <ArrowBackIosRoundedIcon />
    </BuiButton>
    <EquipmentCard bottomLeftText={`T${currentEquipment.tier}`} imageName={currentEquipment.icon} />
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier >= maxTierForCurrentCategory}
      size="large" color={'baButtonLightBackgroundPrimary'} onClick={onPlusOneEquipment}>
      <ArrowForwardIosRoundedIcon />
    </BuiButton>
    <BuiButton sx={{boxShadow: 1}} disabled={currentEquipment.tier >= maxTierForCurrentCategory}
      color={'baButtonSecondary'} onClick={onSetToMaxTierEquipment}>
      {t('addEquipmentDialog.max')}
    </BuiButton>
  </Box>;
};

export default TargetEquipmentSelection;
