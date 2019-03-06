import { combineReducers } from 'redux';
import stateProgramm from 'redux-main/reducers/modules/repair/state_programm/state_programm_reducer';

const repairProgramm = combineReducers({
  stateProgramm,
});

export default repairProgramm;
