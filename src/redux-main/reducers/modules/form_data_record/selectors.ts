import { ReduxState } from 'redux-main/@types/state';
import { getFormDataRecordState } from 'redux-main/reducers/selectors';
import { OneFormDataByKey, IStateFormDataRecord } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export const getFormDataByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord): OneFormDataByKey<F, Store> => (
  getFormDataRecordState(state)[key] as OneFormDataByKey<F, Store>
);
