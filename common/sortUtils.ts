/* eslint-disable valid-jsdoc */
import {isNumber} from 'common/checkVariableTypeUtil';

export enum SortingOrder{
    Descending = 'Descending',
    Ascending = 'Ascending',
}

// Sort two values that may or may not be number.
// There is no guarantee on the order if one(or both) compared values are unknown.
export const sortTwoUnknownValues = (valueA: unknown, valueB: unknown,
    sortingOrder = SortingOrder.Ascending) =>{
  if (!valueA || !valueB || !isNumber(valueA) || !isNumber(valueB)) return 1;

  const sortingWeight = SortingOrder.Descending ? 1 : -1;

  if ((valueA as number) < (valueB as number) ) {
    return sortingWeight;
  } else if ((valueA as number) > (valueB as number) ) {
    return -sortingWeight;
  } else {
    return 0;
  }
};

type Comparator<Item> = (a: Item, b: Item) => number;

const Ordering = {
  /** They are equals. */
  Equal: 0,
  /** The first value is sorted after the second. */
  First: +1,
  /** The second value is sorted after the first. */
  Second: -1,
} as const;

const isNully = (x: unknown): x is null | undefined => {
  return x === null || x === undefined;
};

/**
 * @param keySelector
 *  A mapping function to extract key from an array element.
 *  Note that this function can return null or undefined,
 *  but these values are treated as greater than other values.
 * @param comparatorFn
 *  This comparator functions are applied in order, starting with the first,
 *  and if the previous returns 0, the next is applied.
 *  When all functions s return 0, it means the two elements are equal.
 * @return a comparator function.
 */
export const buildComparator = <Item, Key>(
  keySelector: (item: Item) => (Key | null | undefined),
  ...comparatorFn: Comparator<Key>[]
): Comparator<Item> => {
  return (firstItem, secondItem) => {
    if (firstItem === secondItem) return Ordering.Equal;
    const first = keySelector(firstItem);
    const second = keySelector(secondItem);
    if (first === second) return Ordering.Equal;

    if (isNully(first) || isNully(second)) {
      return (first === second) ? Ordering.Equal :
        isNully(first) ? Ordering.First :
        isNully(second) ? Ordering.Second :
        'unreachable' as never;
    }

    for (const comparator of comparatorFn) {
      const ordering = comparator(first, second);
      if (ordering != Ordering.Equal) return ordering;
    }

    return Ordering.Equal;
  };
};

const numberAscending: Comparator<number> = (a, b) => a - b;
const numberDescending: Comparator<number> = (a, b) => b - a;
const stringAscending: Comparator<string> = (a, b) => a.localeCompare(b);
const stringDescending: Comparator<string> = (a, b) => b.localeCompare(a);
const numericStringAscending = buildComparator(parseFloat, numberAscending);
const numericStringDescending = buildComparator(parseFloat, numberDescending);
export const Comparators = {
  numberAscending, numberDescending,
  stringAscending, stringDescending,
  numericStringAscending, numericStringDescending,
} as const;

export const buildArrayIndexComparator = <Item>(
  array: readonly Item[],
  order: SortingOrder = SortingOrder.Ascending,
) => {
  const comparator = order === SortingOrder.Ascending ?
    Comparators.numberAscending :
    Comparators.numberDescending;
  return buildComparator<Item, number>(
      (item) => {
        const index = array.indexOf(item);
        return index >= 0 ? index : null;
      },
      comparator,
  );
};
