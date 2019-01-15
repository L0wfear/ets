import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { GetStateType } from 'redux-main/reducers/selectors/index';

export const getSpecialModelList: GetStateType<'specialModelList'> = (state) => (
  getSomeUniqState(state).specialModelList
);
