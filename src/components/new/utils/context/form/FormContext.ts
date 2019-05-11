import * as React from 'react';

export const initialContextValue = ({
  addFormData: (config: any, element: any) => null,
  removeFormData: (formDataKey: string) => null,
  handleChangeFormState: (formDataKey: string, obj: any) => null,
  formDataByKey: {},
});

const FormContext = React.createContext<typeof initialContextValue>(initialContextValue);

export default FormContext;
