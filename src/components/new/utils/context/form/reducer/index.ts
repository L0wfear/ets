import { InitialFormContextValue, ConfigFormDataForAdd } from '../FormContext';
import { validate, canSaveTest } from './validate';

type AddFormDataToStore<T = any> = (
  formData: ConfigFormDataForAdd<T>,
  element: Partial<T>,
) => {
  type: 'ADD_FORM_DATA';
  payload: {
    formData: ConfigFormDataForAdd<T>;
    element: Partial<T>;
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

type ChangeFormDataFromState<T = any> = (
  formDataKey: string,
  partialFormState: Partial<T>,
) => {
  type: 'CHANGE_FORM_STATE';
  payload: {
    formDataKey: string,
    partialFormState: Partial<T>;
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

/* ------------------------------------------------------------------------- */

// пока три типа экшенов
const ADD_FORM_DATA = 'ADD_FORM_DATA';
const REMOVE_FORM_DATA = 'REMOVE_FORM_DATA';
const CHANGE_FORM_STATE = 'CHANGE_FORM_STATE';

export const initialFormProviderState: React.ReducerState<ReducerFormProvider> = {
  formDataByKey: {},
};

// экшен добавления formData в formDataByKey
export const addFormDataToStore: AddFormDataToStore = (formData, element) => ({
  type: ADD_FORM_DATA,
  payload: {
    formData,
    element,
  },
});

// экшен удаления formData из formDataByKey по ключу
export const removeFormDataFromStore: RemoveFormDataFromStore = (formDataKey) => ({
  type: REMOVE_FORM_DATA,
  payload: {
    formDataKey,
  },
});

// экшен изменения formState в formData в formDataByKey по ключу и partial<formState>
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

    console.log('⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️'); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT STATE', formState); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT ERRORS', formErrors); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT CANSAVE', canSave); // tslint:disable-line:no-console

    return {
      ...state,
      formDataByKey: {
        ...state.formDataByKey,
        [action.payload.formData.key]: {
          ...action.payload.formData,
          formState,
          formErrors,
          canSave,
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
    let partialFormStateToShow: object | string = action.payload.partialFormState;
    let formErrorsToShow: object | string = action.payload.partialFormState;

    if (!__DEVELOPMENT__) {
      partialFormStateToShow = JSON.stringify(partialFormStateToShow);
      formErrorsToShow = JSON.stringify(formErrorsToShow);
    }

    console.log('⚙️ FORM CHANGE STATE', partialFormStateToShow); // tslint:disable-line:no-console
    console.log('⚙️ FORM CHANGE ERRORS', formErrorsToShow); // tslint:disable-line:no-console
    console.log('⚙️ FORM CANSAVE', canSave); // tslint:disable-line:no-console

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
