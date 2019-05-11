import * as React from 'react';
import { get } from 'lodash';
import FormContext from './FormContext';

const useFormData = (formDataKey: string) => {
  const context = React.useContext(FormContext);

  return context.formDataByKey[formDataKey];
};

const useFormDataSchemaHeader = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'schema.header');
};
const useFormDataSchemaBody = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'schema.body');
};
const useFormDataSchemaFooter = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'schema.footer');
};

const useFormDataSchemaIsCreating = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'IS_CREATING', false);
};

const useFormDataSchemaHandleHide = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'handleHide', null);
};
const useFormDataHandleChange = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'handleChange', null);
};

const useFormDataSchemaPage = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'page', null);
};
const useFormDataSchemaPath = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'path', null);
};

const useFormDataSchemaBodyFields = (formDataKey: string) => {
  const formDataBody = useFormDataSchemaBody(formDataKey);

  return get(formDataBody, 'fields', []);
};

const useFormDataFormState = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'formState', null);
};
const useFormDataFormStatePickValue = (formDataKey: string, key: string) => {
  const formState = useFormDataFormState(formDataKey);

  return get(formState, key, null);
};

const useFormDataFormErrors = (formDataKey: string) => {
  const formData = useFormData(formDataKey);

  return get(formData, 'formErrors', null);
};
const useFormDataIsPermitted = (formDataKey: string) => {
  const IS_CREATING = useFormDataSchemaIsCreating(formDataKey);
  // const permissions = useFormDataPermissions(formDataKey); // нужна валидация в контексте

  return IS_CREATING ? true : true;
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
};
