import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { GetStateType } from 'redux-main/reducers/selectors/index';

export const getModelsListState: GetStateType<'modelsList'> = (state) => (
  getSomeUniqState(state).modelsList
);
