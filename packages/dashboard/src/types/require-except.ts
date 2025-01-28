export type RequireExcept<T, K extends keyof T> = Pick<T, K> &
  Required<Omit<T, K>>;
