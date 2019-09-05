import * as React from 'react';

import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { actionChangeFormState, actionChangeFormStore, actionRemoveFormData } from 'redux-main/reducers/modules/form_data_record/actions';

/* _______________ селекторы хуки _______________ */

/**
 * formData по ключу
 */
const useFormData = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formContext = etsUseSelector((state) => getFormDataByKey<F, Store>(state, formDataKey));

  return formContext;
};

/**
 * получение схемы formData
 */
const useFormDataSchema = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.schema : null;
};

/**
 * полуение шапки схемы
 */
const useFormDataSchemaHeader = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const schema = useFormDataSchema<F, Store>(formDataKey);

  return schema ? schema.header : null;
};

/**
 * полуение тела схемы
 */
const useFormDataSchemaBody = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const schema = useFormDataSchema<F, Store>(formDataKey);

  return schema ? schema.body : null;
};
/**
 * получение полей формы из тела схемы
 */
const useFormDataSchemaBodyFields = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formDataBody = useFormDataSchemaBody<F, Store>(formDataKey);

  return formDataBody ? formDataBody.fields : null;
};

/**
 * полуение футера схемы
 */
const useFormDataSchemaFooter = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const schema = useFormDataSchema<F, Store>(formDataKey);

  return schema ? schema.footer : null;
};

/**
 * получение флага 'Создаётся ли элемент' формы
 */
const useFormDataSchemaIsCreating = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.IS_CREATING : null;
};

/**
 * получение разрешения на создание формы
 */
const useFormDataSchemaIsPermittedToCreate = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.isPermittedToCreate : null;
};

/**
 * получение разрешения на редактирование формы
 */
const useFormDataSchemaIsPermittedToUpdate = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.isPermittedToUpdate : null;
};

/**
 * получение функции закрытия формы
 */
const useFormDataSchemaHandleHide = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);
  const handleHide = formData ? formData.handleHide : null;
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (...arg: Parameters<typeof handleHide>) => {
      handleHide(...arg);
      dispatch(
        actionRemoveFormData(
          formDataKey,
        ),
      );
    },
    [],
  );
};

/**
 * получение функции изменения формы
 */
const useFormDataHandleChange = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialFormState: Partial<F>) => (
      dispatch(
        actionChangeFormState<F, Store>(
          formDataKey,
          partialFormState,
        ),
      )
    ),
    [],
  );
};

/**
 * получение функции сабмита формы
 */
const useFormDataHandleSubmitAction = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.handleSubmitPromise : null;
};

/**
 * получение функции измнения значение стора формы
 */
const useFormDataHandleChangeStore = <Store extends object = {}>(formDataKey: string) => {
  const dispatch = etsUseDispatch();

  return React.useCallback(
    (partialStore: Partial<Store>) => (
      dispatch(
        actionChangeFormStore<object, Store>(
          formDataKey,
          partialStore,
        ),
      )
    ),
    [],
  );
};

/**
 * получение page формы
 */
const useFormDataSchemaPage = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.meta.page : null;
};

/**
 * получение path формы
 */
const useFormDataSchemaPath = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.meta.path : null;
};

/**
 * получение состояния зачений формы (formState)
 */
const useFormDataFormState = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData.formState;
};

/**
 * получение состояния значения формы (formState) по ключу (key)
 */
const useFormDataFormStatePickValue = <F extends object, Store extends object = {}>(formDataKey: string, key: keyof F) => {
  const formState = useFormDataFormState<F, Store>(formDataKey);

  return formState[key];
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrors = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.formErrors : null;
};

/**
 * получение статуса возможности сабмита формы
 */
const useFormDataCanSave = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData ? formData.canSave : null;
};

/**
 * получение статуса возможности изменения формы
 */
const useFormDataIsPermitted = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const IS_CREATING = useFormDataSchemaIsCreating<F, Store>(formDataKey);
  const isPermittedToCreate = useFormDataSchemaIsPermittedToCreate<F, Store>(formDataKey);
  const isPermittedToUpdate = useFormDataSchemaIsPermittedToUpdate<F, Store>(formDataKey);

  return IS_CREATING ? isPermittedToCreate : isPermittedToUpdate;
};

/**
 * получение глобального стора формы
 */
const useFormDataStore = <F extends object, Store extends object = {}>(formDataKey: string) => {
  const formData = useFormData<F, Store>(formDataKey);

  return formData.store;
};

/**
 * получение значения из глобального стора формы
 */
const useFormDataStorePickValue = <F extends object, Store extends object = {}>(formDataKey: string, key: string) => {
  const store = useFormDataStore<F, Store>(formDataKey);

  return store ? store[key] : null;
};

const useFormDataLoadOptions = <Store extends object, K extends keyof Store>(formDataKey: string, key: K, hookData: Store[K]) => {
  const optionData = hookData;
  const handleChangeStore = useFormDataHandleChangeStore<Store>(formDataKey);

  React.useEffect(
    () => {
      const partialStore: Partial<Store> = {};
      partialStore[key] = optionData;

      handleChangeStore(partialStore);
    },
    [handleChangeStore, optionData],
  );

  return optionData;
};

export default {
  useFormData,
  useFormDataSchema,
  useFormDataSchemaHeader,
  useFormDataSchemaBody,
  useFormDataSchemaFooter,
  useFormDataSchemaIsCreating,
  useFormDataSchemaHandleHide,
  useFormDataHandleChangeStore,
  useFormDataSchemaPage,
  useFormDataSchemaPath,
  useFormDataSchemaBodyFields,
  useFormDataFormState,
  useFormDataFormStatePickValue,
  useFormDataFormErrors,
  useFormDataIsPermitted,
  useFormDataHandleChange,
  useFormDataCanSave,
  useFormDataHandleSubmitAction,
  useFormDataSchemaIsPermittedToCreate,
  useFormDataSchemaIsPermittedToUpdate,

  useFormDataStore,
  useFormDataStorePickValue,
  useFormDataLoadOptions,
};
