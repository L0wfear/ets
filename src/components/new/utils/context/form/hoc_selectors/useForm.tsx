import * as React from 'react';
import FormContext, { OneFormDataByKey } from '../FormContext';

/* _______________ селекторы хуки _______________ */

/**
 * formData по ключу
 */
const useFormData = <T extends any, Store extends Record<string, any>>(formDataKey: string): OneFormDataByKey<T, any> => {
  const context = React.useContext(FormContext);

  return context.formDataByKey[formDataKey];
};

/**
 * получение схемы formData
 */
const useFormDataSchema = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.schema : null;
};

/**
 * полуение шапки схемы
 */
const useFormDataSchemaHeader = <T extends any>(formDataKey: string) => {
  const schema = useFormDataSchema<T>(formDataKey);

  return schema ? schema.header : null;
};

/**
 * полуение тела схемы
 */
const useFormDataSchemaBody = <T extends any>(formDataKey: string) => {
  const schema = useFormDataSchema<T>(formDataKey);

  return schema ? schema.body : null;
};
/**
 * получение полей формы из тела схемы
 */
const useFormDataSchemaBodyFields = <T extends any>(formDataKey: string) => {
  const formDataBody = useFormDataSchemaBody<T>(formDataKey);

  return formDataBody ? formDataBody.fields : null;
};

/**
 * полуение футера схемы
 */
const useFormDataSchemaFooter = <T extends any>(formDataKey: string) => {
  const schema = useFormDataSchema<T>(formDataKey);

  return schema ? schema.footer : null;
};

/**
 * получение флага 'Создаётся ли элемент' формы
 */
const useFormDataSchemaIsCreating = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.IS_CREATING : null;
};

/**
 * получение разрешения на создание формы
 */
const useFormDataSchemaIsPermittedToCreate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.isPermittedToCreate : null;
};

/**
 * получение разрешения на редактирование формы
 */
const useFormDataSchemaIsPermittedToUpdate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.isPermittedToUpdate : null;
};

/**
 * получение функции закрытия формы
 */
const useFormDataSchemaHandleHide = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.handleHide : null;
};

/**
 * получение функции изменения формы
 */
const useFormDataHandleChange = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.handleChange : null;
};

/**
 * получение функции сабмита формы
 */
const useFormDataHandleSubmitAction = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.handleSubmitPromise : null;
};

/**
 * получение функции измнения значение стора формы
 */
const useFormDataHandleChangeStore = <T extends any, Store extends Record<string, any>>(formDataKey: string) => {
  const context = React.useContext(FormContext);

  return React.useMemo(
    () => {
      return (partialStore: Partial<Store>) => {
        context.handleChangeStore(
          formDataKey,
          partialStore,
        );
      };
    },
    [context.handleChangeStore],
  );
};

/**
 * получение page формы
 */
const useFormDataSchemaPage = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.page : null;
};

/**
 * получение path формы
 */
const useFormDataSchemaPath = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.path : null;
};

/**
 * получение состояния зачений формы (formState)
 */
const useFormDataFormState = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData.formState;
};

/**
 * получение состояния значения формы (formState) по ключу (key)
 */
const useFormDataFormStatePickValue = <T extends object>(formDataKey: string, key: keyof T) => {
  const formState = useFormDataFormState<T>(formDataKey);

  return formState[key];
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrors = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.formErrors : null;
};

/**
 * получение статуса возможности сабмита формы
 */
const useFormDataCanSave = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T, any>(formDataKey);

  return formData ? formData.canSave : null;
};

/**
 * получение статуса возможности изменения формы
 */
const useFormDataIsPermitted = <T extends any>(formDataKey: string) => {
  const IS_CREATING = useFormDataSchemaIsCreating<T>(formDataKey);
  const isPermittedToCreate = useFormDataSchemaIsPermittedToCreate<T>(formDataKey);
  const isPermittedToUpdate = useFormDataSchemaIsPermittedToUpdate<T>(formDataKey);

  return IS_CREATING ? isPermittedToCreate : isPermittedToUpdate;
};

/**
 * получение глобального стора формы
 */
const useFormDataStore = <T extends any, Store extends Record<string, any>>(formDataKey: string) => {
  const formData = useFormData<T, Store>(formDataKey);

  return formData ? formData.store : null;
};

/**
 * получение значения из глобального стора формы
 */
const useFormDataStorePickValue = <T extends any, Store extends Record<string, any>>(formDataKey: string, key: string) => {
  const store = useFormDataStore<T, Store>(formDataKey);

  return store ? store[key] : null;
};

const useFormDataLoadOptions = <Store extends Record<string, any>, K extends keyof Store>(formDataKey: string, key: K, hookData: Store[K]) => {
  const optionData = hookData;
  const handleChangeStore = useFormDataHandleChangeStore<any, Store>(formDataKey);

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
