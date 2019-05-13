import * as React from 'react';
import FormContext, { initialContextValue, InitialFormContextValue } from './FormContext';
import {
  addFormDataToStore,
  removeFormDataFromStore,
  changeFormDataFromState,
  initialFormProviderState,
  reducerFormProvider,
} from './reducer';

type FormProviderProps = {}; // тк провайдер глобальный, то пока ничего не ждёт

const FormProvider: React.FC<FormProviderProps> = React.memo(
  (props) => {
    // state - { formDataByKey: Record<string, OneFormDataByKey<any>>; }
    const [state, dispatch] = React.useReducer(reducerFormProvider, initialFormProviderState);

    // добавление данных по форме в контекст
    const addFormData = React.useCallback<InitialFormContextValue['addFormData']>(
      (formData, element) => {
        dispatch(addFormDataToStore(formData, element));
      },
      [],
    );
    // удаление данных формы из контекста
    const removeFormData = React.useCallback<InitialFormContextValue['removeFormData']>(
      (formDataKey) => {
        dispatch(removeFormDataFromStore(formDataKey));
      },
      [],
    );
    // изменение состояния формы в контексте по ключу
    const handleChangeFormState = React.useCallback<InitialFormContextValue['handleChangeFormState']>(
      (formDataKey, obj) => {
        dispatch(changeFormDataFromState(formDataKey, obj));
      },
      [],
    );

    // formContext value
    const value: typeof initialContextValue = React.useMemo(
      () => {
        return {
          ...state,
          addFormData,
          removeFormData,
          handleChangeFormState,
        };
      },
      [state, addFormData, removeFormData, handleChangeFormState],
    );

    return (
      <FormContext.Provider value={value}>
        { props.children }
      </FormContext.Provider>
    );
  },
);

export default FormProvider;
