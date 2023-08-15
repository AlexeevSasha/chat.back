export const exclude = <T>(obj: T, ...keys: Array<keyof T>) => {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
};
