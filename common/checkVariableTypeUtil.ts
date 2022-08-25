
export const isString = (str: unknown) =>{
  return typeof str === 'string' || str instanceof String;
};

export const isNumber = (value: unknown) =>{
  return typeof value === 'number' && isFinite(value);
};

