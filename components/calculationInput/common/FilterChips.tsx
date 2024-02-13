import styles from './FilterChips.module.scss';
import {Box, Chip} from '@mui/material';
import {Fragment, useReducer} from 'react';

type ChipSpec = {key: string, label: string};
type FilterSpec = {
  [group: string]: ChipSpec[];
};
type FilterState<T extends FilterSpec> = {
  [group in keyof T]?: T[group][number]['key'];
};
type FilterAction<T extends FilterSpec, G extends keyof T = keyof T> = {
  group: G,
  value: T[G][number]['key'];
};

export const useFilterChips = <T extends FilterSpec>() => {
  const [selected, setSelected] = useReducer((
      selected: FilterState<T> | null,
      action: FilterAction<T> | null,
  ): (FilterState<T> | null) => {
    if (!action) return null;
    const result = {
      ...selected,
      [action.group]: selected?.[action.group] == action.value ? null : action.value,
    } as FilterState<T>;
    return Object.values(result).every((v) => v == null) ? null : result;
  }, null);

  return [selected, setSelected] as const;
};

export const FilterChips = <T extends FilterSpec>({
  spec,
  selected,
  setSelected,
}: {
  spec: T,
  selected: FilterState<T> | null,
  setSelected: (action: FilterAction<T> | null) => void,
}) => {
  const groups = Object.entries(spec).map(([name, group]) => {
    return <Fragment key={name}>
      {group.map(({key, label}) => {
        const checked = key === selected?.[key];
        return <Chip key={key}
          className={styles.chip} label={label} size='small'
          variant={checked ? 'filled' : 'outlined'}
          color={'primary'}
          onClick={() => setSelected({group: name, value: key})} />;
      })}
    </Fragment>;
  });

  return <Box className={styles.container}>{groups}</Box>;
};
