import { ReduxState } from 'redux-main/@types/state';

export const getInspect = (state: ReduxState) => (
  state.inspect
);

export const getInspectAutobase = (state: ReduxState) => (
  getInspect(state).inspectAutobase
);

export const getInspectPgmBase = (state: ReduxState) => (
  getInspect(state).inspectPgmBase
);

export const getInspectCarsCondition = (state: ReduxState) => (
  getInspect(state).inspectCarsCondition
);
