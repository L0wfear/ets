import { ReduxState } from 'redux-main/@types/state';
import { getFormDataRecordState } from 'redux-main/reducers/selectors';
import { OneFormDataByKey, IStateFormDataRecord } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export const getFormDataByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataRecordState(state)[key] as OneFormDataByKey<F>
);

export const getFormDataIsCreatingByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).IS_CREATING
);
export const getFormDataIsPermittedToCreateByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).isPermittedToCreate
);
export const getFormDataIsPermittedToUpdateByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).isPermittedToUpdate
);
export const getFormDataIsPermittedByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataIsPermittedToCreateByKey<F, Store>(state, key)
  || getFormDataIsPermittedToUpdateByKey<F, Store>(state, key)
);

export const getFormDataMetaByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).meta
);

export const getFormDataFormStateByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).formState
);
export const getFormDataFormStatePickValueByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord, value_key: keyof F) => (
  getFormDataByKey<F, Store>(state, key).formState[value_key]
);

export const getFormDataFormErrorsByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).formErrors
);
export const getFormDataCanSaveByKey = <F extends object, Store extends object = {}>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).canSave
);
