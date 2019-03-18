import { ReduxState } from 'redux-main/@types/state';

export const getInspect = (state: ReduxState) => (
  state.inspect
);

export const getInspectAutobse = (state: ReduxState) => (
  getInspect(state).inspectAutobase
);
