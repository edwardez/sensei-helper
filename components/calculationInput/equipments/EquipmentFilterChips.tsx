import styles from './EquipmentFilterChips.module.scss';
import {Box, Chip} from '@mui/material';
import {Equipment} from 'model/Equipment';
import {useTranslation} from 'next-i18next';
import {useEffect, useMemo, useReducer} from 'react';

export const equipmentCategories = [
  'Hat', 'Gloves', 'Shoes',
  'Bag', 'Badge', 'Hairpin',
  'Charm', 'Watch', 'Necklace',
] as const;
type EquipmentCategory = typeof equipmentCategories[number];

type SelectAction = {tier: number} | {category: EquipmentCategory};
type SelectionState = {tier?: number, category?: EquipmentCategory};
export const useEquipmentFilterChips = () => {
  const [selected, setSelected] = useReducer((
      selected: SelectionState,
      action: SelectAction,
  ): SelectionState => {
    return 'tier' in action ? {
      ...selected,
      tier: selected.tier == action.tier ? undefined : action.tier,
    } : {
      ...selected,
      category: selected.category == action.category ? undefined : action.category,
    };
  }, {});
  const equipmentFilter = useMemo(() => {
    if (!selected.tier && !selected.category) return null;
    return (equipment: Equipment) => {
      return (!selected.tier || equipment.tier === selected.tier) &&
        (!selected.category || equipment.category === selected.category);
    };
  }, [selected]);

  return [selected, setSelected, equipmentFilter] as const;
};

export const EquipmentFilterChips = ({
  defaultTier,
  defaultCategory,
  minTier = 1,
  maxTier,
  selected,
  setSelected,
}: {
  defaultTier?: number,
  defaultCategory?: EquipmentCategory,
  minTier?: number,
  maxTier: number,
  selected: SelectionState,
  setSelected: (action: SelectAction) => void,
}) => {
  const {t} = useTranslation();
  const tiers = useMemo(() => {
    return Array.from({length: maxTier - 1}, (_, i) => ({
      key: i + minTier,
      label: `T${i + minTier}`,
    }));
  }, [minTier, maxTier]);
  const categories = useMemo(() => {
    return equipmentCategories.map((key) => ({
      key,
      label: t(`equipmentCategory.${key}`),
    }));
  }, [t]);

  useEffect(() => {
    defaultTier && setSelected({tier: defaultTier});
    defaultCategory && setSelected({category: defaultCategory});
  }, [setSelected, defaultTier, defaultCategory]);

  return <Box className={styles.container}>
    {categories.map(({key, label}) => {
      const checked = key === selected.category;
      return <Chip className={styles.chip}
        key={key} label={label} size='small'
        variant={checked ? 'filled' : 'outlined'}
        color={'primary'}
        onClick={() => setSelected({category: key})} />;
    })}
    <Box className={styles.divider} />
    {tiers.map(({key, label}) => {
      const checked = key === selected.tier;
      return <Chip className={styles.chip}
        key={key} label={label} size='small'
        variant={checked ? 'filled' : 'outlined'}
        color={'primary'}
        onClick={() => setSelected({tier: key})} />;
    })}
  </Box>;
};
