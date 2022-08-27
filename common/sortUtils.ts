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


