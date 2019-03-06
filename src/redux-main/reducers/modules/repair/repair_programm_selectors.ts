import { ReduxState } from 'redux-main/@types/state';

export const getRepairProgramm = (state: ReduxState) => (
  state.repairProgramm
);

export const getRepairProgrammstateProgramm = (state: ReduxState) => (
  getRepairProgramm(state).stateProgramm
);
