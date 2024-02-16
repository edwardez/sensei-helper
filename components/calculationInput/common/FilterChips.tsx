import styles from './FilterChips.module.scss';
import {Box, Chip} from '@mui/material';
import {Fragment, Key, useEffect, useMemo, useReducer} from 'react';

type ChipSpec = {key: Key, label: string};
type FilterSpec = {
  [group: string]: ChipSpec[];
};
type FilterState<T extends FilterSpec> = {
  [group in keyof T]?: T[group][number]['key'];
};
type FilterAction<T extends FilterSpec, G extends keyof T = keyof T> = {
  group: G,
  key: T[G][number]['key'];
};

export const useFilterChips = <T extends FilterSpec>(spec: T) => {
  const [selected, setSelected] = useReducer((
      selected: FilterState<T> | null,
      action: FilterAction<T> | null,
  ): (FilterState<T> | null) => {
    if (!action) return null;
    const result = {
      ...selected,
      [action.group]: selected?.[action.group] == action.key ? null : action.key,
    } as FilterState<T>;
    return Object.values(result).every((v) => v == null) ? null : result;
  }, null);
  const chips = useMemo(() => {
    return <FilterChips
      spec={spec}
      selected={selected}
      setSelected={setSelected} />;
  }, [spec, selected]);

  useEffect(() => {
    // reset when the spec changed
    setSelected(null);
  }, [spec]);

  return [selected, setSelected, chips] as const;
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
  const groups = Object.entries(spec).map(([group, children]) => {
    return <Fragment key={group}>
      {children.map(({key, label}) => {
        const checked = key === selected?.[group];
        return <Chip key={key} label={label}
          className={styles.chip} size='small' color={'primary'}
          variant={checked ? 'filled' : 'outlined'}
          onClick={() => setSelected({group, key})} />;
      })}
      <div className={styles.divider} />
    </Fragment>;
  });

  return <Box className={styles.container}>{groups}</Box>;
};
