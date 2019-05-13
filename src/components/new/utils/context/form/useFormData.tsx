import * as React from 'react';
import FormContext, { OneFormDataByKey } from './FormContext';

/* _______________ селекторы хуки _______________ */

/**
 * formData по ключу
 */
const useFormData = <T extends any>(formDataKey: string): OneFormDataByKey<T> => {
  const context = React.useContext(FormContext);

  return context.formDataByKey[formDataKey];
};

/**
 * получение схемы formData
 */
const useFormDataSchema = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

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
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.IS_CREATING : null;
};

/**
 * получение разрешения на создание формы
 */
const useFormDataSchemaIsPermittedToCreate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.isPermittedToCreate : null;
};

/**
 * получение разрешения на редактирование формы
 */
const useFormDataSchemaIsPermittedToUpdate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.isPermittedToUpdate : null;
};

/**
 * получение функции закрытия формы
 */
const useFormDataSchemaHandleHide = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleHide : null;
};

/**
 * получение функции изменения формы
 */
const useFormDataHandleChange = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleChange : null;
};

/**
 * получение функции сабмита формы
 */
const useFormDataHandleSubmitAction = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleSubmitPromise : null;
};

/**
 * получение page формы
 */
const useFormDataSchemaPage = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.page : null;
};

/**
 * получение path формы
 */
const useFormDataSchemaPath = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.path : null;
};

/**
 * получение состояния зачений формы (formState)
 */
const useFormDataFormState = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.formState : null;
};

/**
 * получение состояния значения формы (formState) по ключу (key)
 */
const useFormDataFormStatePickValue = <T extends any>(formDataKey: string, key: string) => {
  const formState = useFormDataFormState<T>(formDataKey);

  return formState ? formState[key] : null;
};

/**
 * получение состояния ошибок (formErrors)
 */
const useFormDataFormErrors = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.formErrors : null;
};

/**
 * получение статуса возможности сабмита формы
 */
const useFormDataCanSave = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

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

export default {
  useFormData,
  useFormDataSchema,
  useFormDataSchemaHeader,
  useFormDataSchemaBody,
  useFormDataSchemaFooter,
  useFormDataSchemaIsCreating,
  useFormDataSchemaHandleHide,
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
};
