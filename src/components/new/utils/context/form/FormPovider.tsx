import * as React from 'react';
import { get } from 'lodash';
import FormContext, { initialContextValue } from './FormContext';

type FormProviderProps = {};

const ADD_FORM_DATA = 'ADD_FORM_DATA';
const REMOVE_FORM_DATA = 'REMOVE_FORM_DATA';
const CHANGE_FORM_STATE = 'CHANGE_FORM_STATE';

type AddFormDataToStore = (
  formData: any,
  element: any,
) => {
  type: 'ADD_FORM_DATA';
  payload: {
    formData: any;
    element: any;
  },
};
type RemoveFormDataFromStore = (
  formDataKey: string,
) => {
  type: 'REMOVE_FORM_DATA',
  payload: {
    formDataKey: string,
  },
};
type ChangeFormDataFromState = (
  formDataKey: string,
  partialFormState: any,
) => {
  type: 'CHANGE_FORM_STATE';
  payload: {
    formDataKey: string,
    partialFormState: any;
  },
};

const addFormDataToStore: AddFormDataToStore = (formData, element) => ({
  type: ADD_FORM_DATA,
  payload: {
    formData,
    element,
  },
});

const removeFormDataFromStore: RemoveFormDataFromStore = (formDataKey) => ({
  type: REMOVE_FORM_DATA,
  payload: {
    formDataKey,
  },
});

const changeFormDataFromState: ChangeFormDataFromState = (formDataKey, partialFormState) => ({
  type: CHANGE_FORM_STATE,
  payload: {
    formDataKey,
    partialFormState,
  },
});

const reducer: React.Reducer<any, ReturnType<AddFormDataToStore> | ReturnType<RemoveFormDataFromStore> | ReturnType<ChangeFormDataFromState>> = (state, action) => {
  if (action.type === ADD_FORM_DATA) {

    const formState = action.payload.formData.mergeElement(action.payload.element);
    const formErrors = {};

    const IS_CREATING = Boolean(get(
      formState,
      get(action.payload.formData, 'uniqField', 'id'),
      false,
    ));

    return {
      ...state,
      formDataByKey: {
        ...state.formDataByKey,
        [action.payload.formData.key]: {
          ...action.payload.formData,
          formState,
          formErrors,
          IS_CREATING,
        },
      },
    };
  }

  if (action.type === REMOVE_FORM_DATA) {
    const formDataByKey = { ...state.formDataByKey };
    delete formDataByKey[action.payload.formDataKey];

    return {
      ...state,
      formDataByKey,
    };
  }
  if (action.type === CHANGE_FORM_STATE) {
    const formDataByKey = { ...state.formDataByKey };
    formDataByKey[action.payload.formDataKey].formState = {
      ...state.formDataByKey[action.payload.formDataKey].formState,
      ...action.payload.partialFormState,
    };

    return {
      ...state,
      formDataByKey,
    };
  }
  return state;
};

const initialState: React.ReducerState<typeof reducer> = {
  formDataByKey: {},
};

const FormProvider: React.FC<FormProviderProps> = React.memo(
  (props) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const addFormData = React.useCallback(
      (formData: any, element) => {
        dispatch(addFormDataToStore(formData, element));
      },
      [],
    );
    const removeFormData = React.useCallback(
      (formDataKey: string) => {
        dispatch(removeFormDataFromStore(formDataKey));
      },
      [],
    );
    const handleChangeFormState = React.useCallback(
      (formDataKey: string, obj) => {
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
