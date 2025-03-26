export const randomId = (n = 18) => {
  const bytes = String.fromCharCode(...Array.from(crypto.getRandomValues(new Uint8Array(n))));
  return window.btoa(bytes);
};
