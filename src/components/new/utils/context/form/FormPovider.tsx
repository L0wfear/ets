import * as React from 'react';
import FormContext, { initialContextValue, InitialFormContextValue } from './FormContext';
import {
  addFormDataToStore,
  removeFormDataFromStore,
  changeFormDataFromState,
  initialFormProviderState,
  reducerFormProvider,
} from './reducer';

type FormProviderProps = {};

const FormProvider: React.FC<FormProviderProps> = React.memo(
  (props) => {
    const [state, dispatch] = React.useReducer(reducerFormProvider, initialFormProviderState);

    const addFormData = React.useCallback<InitialFormContextValue['addFormData']>(
      (formData, element) => {
        dispatch(addFormDataToStore(formData, element));
      },
      [],
    );
    const removeFormData = React.useCallback<InitialFormContextValue['removeFormData']>(
      (formDataKey) => {
        dispatch(removeFormDataFromStore(formDataKey));
      },
      [],
    );
    const handleChangeFormState = React.useCallback<InitialFormContextValue['handleChangeFormState']>(
      (formDataKey, obj) => {
        dispatch(changeFormDataFromState(formDataKey, obj));
      },
      [],
    );

    const value: typeof initialContextValue = React.useMemo(
      () => {
        return {
          ...state,
          addFormData,
          removeFormData,
          handleChangeFormState,
        };
      },
      [state, addFormData, handleChangeFormState],
    );

    return (
      <FormContext.Provider value={value}>
        { props.children }
      </FormContext.Provider>
    );
  },
);

export default FormProvider;
