import { get } from 'lodash';
import { InitialFormContextValue, ConfigFormDataForAdd } from "../FormContext";
import { validate } from './validate';
import { isObject, isArray } from 'util';

type AddFormDataToStore<T = any> = (
  formData: ConfigFormDataForAdd<T>,
  element: Partial<T>,
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

type InitialStateProvider = {
  formDataByKey: InitialFormContextValue['formDataByKey'],
};
type ReducerFormProvider = (
  React.Reducer<
    InitialStateProvider,
    ReturnType<AddFormDataToStore>
    | ReturnType<RemoveFormDataFromStore>
    | ReturnType<ChangeFormDataFromState>
  >
);

const ADD_FORM_DATA = 'ADD_FORM_DATA';
const REMOVE_FORM_DATA = 'REMOVE_FORM_DATA';
const CHANGE_FORM_STATE = 'CHANGE_FORM_STATE';

const canSaveTest = (errors: any) => {
  if (isObject(errors)) {
    return Object.values(errors).every((error) => canSaveTest(error));
  }
  if (isArray(errors)) {
    return errors.every((error) => canSaveTest(error));
  }

  return !errors;
};

export const initialFormProviderState: React.ReducerState<ReducerFormProvider> = {
  formDataByKey: {},
};

export const addFormDataToStore: AddFormDataToStore = (formData, element) => ({
  type: ADD_FORM_DATA,
  payload: {
    formData,
    element,
  },
});

export const removeFormDataFromStore: RemoveFormDataFromStore = (formDataKey) => ({
  type: REMOVE_FORM_DATA,
  payload: {
    formDataKey,
  },
});

export const changeFormDataFromState: ChangeFormDataFromState = (formDataKey, partialFormState) => ({
  type: CHANGE_FORM_STATE,
  payload: {
    formDataKey,
    partialFormState,
  },
});

export const reducerFormProvider: ReducerFormProvider = (state, action) => {
  if (action.type === ADD_FORM_DATA) {

    const formState = action.payload.formData.mergeElement(action.payload.element);
    const formErrors = validate<typeof formState, typeof formState>(action.payload.formData.schema.body, formState);
    const canSave = canSaveTest(formErrors);

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
          canSave,
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
    const formState = {
      ...state.formDataByKey[action.payload.formDataKey].formState,
      ...action.payload.partialFormState,
    };
    const formErrors = validate<typeof formState, typeof formState>(formDataByKey[action.payload.formDataKey].schema.body, formState);
    const canSave = canSaveTest(formErrors);

    console.log('----'); // tslint:disable-line:no-console
    console.log('FORM CHANGE STATE', action.payload.partialFormState); // tslint:disable-line:no-console
    console.log('FORM CHANGE ERRORS', formErrors); // tslint:disable-line:no-console
    console.log('FORM CANSAVE', canSave); // tslint:disable-line:no-console

    formDataByKey[action.payload.formDataKey].formState = formState;
    formDataByKey[action.payload.formDataKey].formErrors = formErrors;
    formDataByKey[action.payload.formDataKey].canSave = canSave;

    return {
      ...state,
      formDataByKey,
    };
  }
  return state;
};
