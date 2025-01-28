type DefineValues<T> = {
  [K in keyof T]: T[K] extends infer U | undefined ? U : T[K];
};

const reduceEntryToDefinedObject = <T>(
  acc: T,
  [key, value]: readonly [string, unknown],
): T => {
  if (typeof value === 'undefined') {
    return acc;
  }
  return {
    ...acc,
    [key]: value,
  };
};

export default function stripUndefinedValues<T extends object>(
  value: T,
): DefineValues<T> {
  const initialValue = {} as DefineValues<T>;
  return Object.entries(value).reduce(reduceEntryToDefinedObject, initialValue);
}
