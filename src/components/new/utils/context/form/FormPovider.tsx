import * as React from 'react';
import FormContext, { initialContextValue, InitialFormContextValue } from './FormContext';
import {
  addFormDataToStore,
  removeFormDataFromStore,
  changeFormDataFromState,
  initialFormProviderState,
  reducerFormProvider,
  changeFormDataStore,
} from './reducer';
import { getSessionState } from 'redux-main/reducers/selectors';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type FormProviderProps = {}; // тк провайдер глобальный, то пока ничего не ждёт

const FormProvider: React.FC<FormProviderProps> = React.memo(
  (props) => {
    // state - { formDataByKey: Record<string, OneFormDataByKey<any>>; }
    const [state, dispatch] = React.useReducer(reducerFormProvider, initialFormProviderState);
    const sessionData = etsUseSelector((stateRedux) => getSessionState(stateRedux));

    // добавление данных по форме в контекст
    const addFormData = React.useCallback<InitialFormContextValue['addFormData']>(
      (formData, element) => {
        dispatch(addFormDataToStore(formData.key, formData, element, sessionData));
      },
      [sessionData],
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

    // изменение состояния стора в контексте
    const handleChangeStore = React.useCallback<InitialFormContextValue['handleChangeFormState']>(
      (formDataKey, obj) => {
        dispatch(changeFormDataStore(formDataKey, obj));
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
          handleChangeStore,
        };
      },
      [state, addFormData, removeFormData, handleChangeFormState, handleChangeStore],
    );

    return (
      <FormContext.Provider value={value}>
        { props.children }
      </FormContext.Provider>
    );
  },
);

export default FormProvider;
