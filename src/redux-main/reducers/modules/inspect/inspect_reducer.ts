import { combineReducers } from 'redux';

import { IStateInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import inspectAutobase from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase';
import inspectPgmBase from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base';

const inspect = combineReducers<IStateInspect>({
  inspectAutobase,
  inspectPgmBase,
});

export default inspect;
