import { combineReducers } from 'redux';

import { IStateInspect } from 'redux-main/reducers/modules/inspect/@types/inspect_reducer';
import inspectAutobase from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase';

const inspect = combineReducers<IStateInspect>({
  inspectAutobase,
});

export default inspect;
