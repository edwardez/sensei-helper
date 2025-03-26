import {Equipment} from 'model/Equipment';
import {useTranslation} from 'next-i18next';
import {useMemo} from 'react';
import {useFilterChips} from '../common/FilterChips';

const range = (start: number, endInclusive: number) => {
  return Array.from({length: endInclusive - start + 1}, (_, i) => i + start);
};

const isNully = (x: unknown): x is null | undefined => x === null || x === undefined;

export const equipmentCategories = [
  'Hat', 'Gloves', 'Shoes',
  'Bag', 'Badge', 'Hairpin',
  'Charm', 'Watch', 'Necklace',
] as const;
type EquipmentCategory = typeof equipmentCategories[number];

export const useEquipmentFilterChips = ({
  minTier = 1, maxTier,
  categories = equipmentCategories,
}: {
  minTier?: number, maxTier: number,
  categories?: readonly EquipmentCategory[],
}) => {
  const {t} = useTranslation();
  const spec = useMemo(() => ({
    tier: range(minTier, maxTier).map((key) => ({key, label: `T${key}`})),
    category: categories.map((key) => ({key, label: t(`equipmentCategory.${key}`)})),
  }), [categories, maxTier, minTier, t]);
  const [selected, setSelected, chips] = useFilterChips(spec);
  const equipmentFilter = useMemo(() => {
    if (!selected) return null;
    return (equipment: Equipment) => {
      return (isNully(selected.tier) || equipment.tier === selected.tier) &&
        (isNully(selected.category) || equipment.category === selected.category);
    };
  }, [selected]);

  return [selected, setSelected, equipmentFilter, chips] as const;
};
