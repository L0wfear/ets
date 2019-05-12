import * as React from 'react';
import FormContext, { OneFormDataByKey } from './FormContext';

const useFormData = <T extends any>(formDataKey: string): OneFormDataByKey<T> => {
  const context = React.useContext(FormContext);

  return context.formDataByKey[formDataKey];
};

const useFormDataSchemaHeader = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.schema.header : null;
};
const useFormDataSchemaBody = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.schema.body : null;
};
const useFormDataSchemaFooter = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.schema.footer : null;
};

const useFormDataSchemaIsCreating = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.IS_CREATING : null;
};
const useFormDataSchemaIsPermittedToCreate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.isPermittedToCreate : null;
};
const useFormDataSchemaIsPermittedToUpdate = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.isPermittedToUpdate : null;
};

const useFormDataSchemaHandleHide = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleHide : null;
};
const useFormDataHandleChange = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleChange : null;
};
const useFormDataHandleSubmitAction = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.handleSubmitPromise : null;
};

const useFormDataSchemaPage = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.page : null;
};
const useFormDataSchemaPath = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.path : null;
};

const useFormDataSchemaBodyFields = <T extends any>(formDataKey: string) => {
  const formDataBody = useFormDataSchemaBody<T>(formDataKey);

  return formDataBody ? formDataBody.fields : null;
};

const useFormDataFormState = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.formState : null;
};
const useFormDataFormStatePickValue = <T extends any>(formDataKey: string, key: string) => {
  const formState = useFormDataFormState<T>(formDataKey);

  return formState ? formState[key] : null;
};

const useFormDataFormErrors = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.formErrors : null;
};

const useFormDataCanSave = <T extends any>(formDataKey: string) => {
  const formData = useFormData<T>(formDataKey);

  return formData ? formData.canSave : null;
};

const useFormDataIsPermitted = <T extends any>(formDataKey: string) => {
  const IS_CREATING = useFormDataSchemaIsCreating<T>(formDataKey);
  const isPermittedToCreate = useFormDataSchemaIsPermittedToCreate<T>(formDataKey);
  const isPermittedToUpdate = useFormDataSchemaIsPermittedToUpdate<T>(formDataKey);

  return IS_CREATING ? isPermittedToCreate : isPermittedToUpdate;
};

export default {
  useFormData,
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
