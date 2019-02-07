export type ETSLoading<A, M = { promise: true, page?: string, path?: string }, T = string> = Promise<{
  type: T;
  payload: A;
  meta: M
}>;
