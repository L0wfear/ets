/**
 * Universal data fetching root level field reducer
 */
class FetchingStatusReducer {
  constructor(private entity: string) {}
  start(rootState) {
    return {
      ...rootState,
      [`${this.entity}Fetching`]: true,
      [`${this.entity}FetchingError`]: false,
    };
  }
  done(rootState) {
    return {
      ...rootState,
      [`${this.entity}Fetching`]: false,
      [`${this.entity}FetchingError`]: false,
    };
  }
  error(rootState) {
    return {
      ...rootState,
      [`${this.entity}FetchingError`]: true,
      [`${this.entity}Fetching`]: false,
    };
  }
}

export function FetchingStatusReducerFactory(entity: string): FetchingStatusReducer {
  return new FetchingStatusReducer(entity);
}
