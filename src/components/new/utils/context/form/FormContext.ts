import * as React from 'react';
import { SchemaFormContext, FormErrorBySchema } from '../@types';

export type OneFormDataByKey<F> = {
  key: string;
  mergeElement: (element: Partial<F>) => F;
  uniqField: keyof F;
  schema: SchemaFormContext<F>;
  permissions: {
    create: string | string[] | boolean;
    update: string | string[] | boolean;
    [k: string]: any;
  };

  formState: F;
  formErrors: FormErrorBySchema<F, SchemaFormContext<F>['body'], F>;
  IS_CREATING: boolean;
  page: string;
  path: string;
  handleHide: (isSubmitted: boolean | any, resultSubmit?: F) => void;
  handleChange: (objChange: Partial<F>) => void;
};

type InitialFormContextValue = {
  addFormData: <T extends any>(config: Partial<OneFormDataByKey<T>>, element: Partial<T>) => void;
  removeFormData: <T extends any>(formDataKey: OneFormDataByKey<T>['key']) => void;
  handleChangeFormState: <T extends any>(formDataKey: string, obj: Partial<OneFormDataByKey<T>['formState']>) => void;
  formDataByKey: {
    [k: string]: OneFormDataByKey<any>;
  };
};
export const initialContextValue: InitialFormContextValue = ({
  addFormData: (config: any, element: any) => null,
  removeFormData: (formDataKey: string) => null,
  handleChangeFormState: (formDataKey: string, obj: any) => null,
  formDataByKey: {},
});

const FormContext = React.createContext<typeof initialContextValue>(initialContextValue);

export default FormContext;
