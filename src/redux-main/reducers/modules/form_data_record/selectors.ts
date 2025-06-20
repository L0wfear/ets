import { ReduxState } from 'redux-main/@types/state';
import { getFormDataRecordState } from 'redux-main/reducers/selectors';
import { OneFormDataByKey, IStateFormDataRecord } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export const getFormDataByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataRecordState(state)[key] as OneFormDataByKey<F>
);

export const getFormDataIsCreatingByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).IS_CREATING
);
export const getFormDataIsPermittedToCreateByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).isPermittedToCreate
);
export const getFormDataIsPermittedToUpdateByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).isPermittedToUpdate
);
export const getFormDataIsPermittedByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataIsPermittedToCreateByKey<F>(state, key)
  || getFormDataIsPermittedToUpdateByKey<F>(state, key)
);

export const getFormDataMetaByKey = (state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<any>(state, key).meta
);

export const getFormDataFormStateByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).formState
);
export const getFormDataOriginFormStateByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).originalFormState
);

export const getFormDataFormStatePickValueByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord, value_key: keyof F) => (
  getFormDataByKey<F>(state, key).formState[value_key]
);

export const getFormDataFormErrorsByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).formErrors
);
export const getFormDataCanSaveByKey = <F extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F>(state, key).canSave
);
