import { SOME_UNIQ_SET_DATA } from 'redux-main/reducers/modules/some_uniq/some_uniq';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';

export const someUniqSetNewData = (newStateData: { [K in keyof IStateSomeUniq]?: IStateSomeUniq[K] }) => ({
  type: SOME_UNIQ_SET_DATA,
  payload: newStateData,
});

export const someUniqSetNewDataNew = (name: keyof IStateSomeUniq) => (newStateData: { data: IStateSomeUniq[keyof IStateSomeUniq]; [k: string]: any }) => (dispatch) => {
  return dispatch(
    someUniqSetNewData(
      {
        [name]: newStateData.data,
      },
    ),
  );
};
