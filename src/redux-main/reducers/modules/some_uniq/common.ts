import { SOME_UNIQ_SET_DATA } from 'redux-main/reducers/modules/some_uniq/some_uniq';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const someUniqSetNewData = (newStateData: { [K in keyof IStateSomeUniq]?: IStateSomeUniq[K] }) => ({
  type: SOME_UNIQ_SET_DATA,
  payload: newStateData,
});
