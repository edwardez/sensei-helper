

const isLocalStorageDefinedAndEnabled = () => {
  return typeof localStorage !== 'undefined' && localStorage;
};


export const getFromLocalStorage = (key: string): any =>{
  if (!isLocalStorageDefinedAndEnabled() || !key) return null;

  return localStorage.getItem(key);
};

export const setToLocalStorage = (key: string, value: string): any =>{
  if (!isLocalStorageDefinedAndEnabled() || !key) return null;

  return localStorage.setItem(key, value);
};
