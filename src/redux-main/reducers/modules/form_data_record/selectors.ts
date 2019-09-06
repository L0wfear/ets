import { ReduxState } from 'redux-main/@types/state';
import { getFormDataRecordState } from 'redux-main/reducers/selectors';
import { OneFormDataByKey, IStateFormDataRecord } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export const getFormDataByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataRecordState(state)[key] as OneFormDataByKey<F, Store>
);

export const getFormDataShemaByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).schema
);

export const getFormDataShemaHeaderByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataShemaByKey<F, Store>(state, key).header
);
export const getFormDataShemaBodyByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataShemaByKey(state, key).body
);
export const getFormDataShemaBodyFieldsByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataShemaBodyByKey<F, Store>(state, key).fields
);
export const getFormDataShemaFooterByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataShemaByKey<F, Store>(state, key).footer
);

export const getFormDataIsCreatingByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).IS_CREATING
);
export const getFormDataIsPermittedToCreateByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).isPermittedToCreate
);
export const getFormDataIsPermittedToUpdateByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).isPermittedToUpdate
);
export const getFormDataIsPermittedByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataIsPermittedToCreateByKey<F, Store>(state, key)
  || getFormDataIsPermittedToUpdateByKey<F, Store>(state, key)
);

export const getFormDataHandleHideByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).handleHide
);

export const getFormDataHandleSubmitPromiseByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).handleSubmitPromise
);

export const getFormDataMetaByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).meta
);

export const getFormDataFormStateByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).formState
);
export const getFormDataFormStatePickValueByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord, value_key: keyof F) => (
  getFormDataByKey<F, Store>(state, key).formState[value_key]
);

export const getFormDataFormErrorsByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).formErrors
);
export const getFormDataCanSaveByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).canSave
);

export const getFormDataStoreByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).store
);

export const getFormDataPErmissionsByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).permissions
);

export const getFormDataBsSizeFormByKey = <F extends object, Store extends object>(state: ReduxState, key: keyof IStateFormDataRecord) => (
  getFormDataByKey<F, Store>(state, key).bsSizeForm
);
