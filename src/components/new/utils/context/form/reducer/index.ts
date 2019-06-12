import { InitialFormContextValue, ConfigFormDataForAdd } from '../FormContext';
import { validate, canSaveTest } from './validate';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';

type AddFormDataToStore<T = any, Store = Record<string, any>> = (
  formDataKey: string,
  formData: ConfigFormDataForAdd<T, Store>,
  element: Partial<T>,
  sessionData: InitialStateSession,
) => {
  type: 'ADD_FORM_CONTEXT_FORM_DATA';
  payload: {
    formDataKey: string;
    formData: ConfigFormDataForAdd<T, Store>;
    element: Partial<T>;
    sessionData: InitialStateSession,
  },
};

type RemoveFormDataFromStore = (
  formDataKey: string,
) => {
  type: 'REMOVE_FORM_CONTEXT_FORM_DATA',
  payload: {
    formDataKey: string,
  },
};

type ChangeFormDataFromState<T = any> = (
  formDataKey: string,
  partialFormState: Partial<T>,
) => {
  type: 'CHANGE_FORM_CONTEXT_FORM_STATE';
  payload: {
    formDataKey: string,
    partialFormState: Partial<T>;
  },
};

type ChangeFormDataStore<S = any> = (
  formDataKey: string,
  partialStore: Partial<S>,
) => {
  type: 'CHANGE_FORM_CONTEXT_STORE';
  payload: {
    formDataKey: string,
    partialStore: Partial<S>;
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
    | ReturnType<ChangeFormDataStore>
  >
);

/* ------------------------------------------------------------------------- */

// пока три типа экшенов
const ADD_FORM_CONTEXT_FORM_DATA = 'ADD_FORM_CONTEXT_FORM_DATA';
const REMOVE_FORM_CONTEXT_FORM_DATA = 'REMOVE_FORM_CONTEXT_FORM_DATA';
const CHANGE_FORM_CONTEXT_FORM_STATE = 'CHANGE_FORM_CONTEXT_FORM_STATE';
const CHANGE_FORM_CONTEXT_STORE = 'CHANGE_FORM_CONTEXT_STORE';

export const initialFormProviderState: React.ReducerState<ReducerFormProvider> = {
  formDataByKey: {},
};

// экшен добавления formData в formDataByKey
export const addFormDataToStore: AddFormDataToStore = (formDataKey, formData, element, sessionData) => ({
  type: ADD_FORM_CONTEXT_FORM_DATA,
  payload: {
    formDataKey,
    formData,
    element,
    sessionData,
  },
});

// экшен удаления formData из formDataByKey по ключу
export const removeFormDataFromStore: RemoveFormDataFromStore = (formDataKey) => ({
  type: REMOVE_FORM_CONTEXT_FORM_DATA,
  payload: {
    formDataKey,
  },
});

// экшен изменения formState в formData в formDataByKey по ключу и partial<formState>
export const changeFormDataFromState: ChangeFormDataFromState = (formDataKey, partialFormState) => ({
  type: CHANGE_FORM_CONTEXT_FORM_STATE,
  payload: {
    formDataKey,
    partialFormState,
  },
});

// экшен изменения store в formData в formDataByKey по ключу и partial<store>
export const changeFormDataStore: ChangeFormDataStore = (formDataKey, partialStore) => ({
  type: CHANGE_FORM_CONTEXT_STORE,
  payload: {
    formDataKey,
    partialStore,
  },
});

export const reducerFormProvider: ReducerFormProvider = (state, action) => {
  if (action.type === ADD_FORM_CONTEXT_FORM_DATA) {
    const formDataByKey = { ...state.formDataByKey };

    const formState = action.payload.formData.mergeElement(action.payload.element, action.payload.sessionData);
    const formErrors = validate<typeof formState>(action.payload.formData.schema.body, formState);
    const canSave = canSaveTest(formErrors);

    console.log('⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️⭕️'); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT FORM STATE', formState); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT FORM ERRORS', formErrors); // tslint:disable-line:no-console
    console.log('⚙️ FORM INIT CANSAVE', canSave); // tslint:disable-line:no-console

    formDataByKey[action.payload.formData.key] = {
      ...action.payload.formData,
      formState,
      formErrors,
      canSave,
    };

    return {
      ...state,
      formDataByKey,
    };
  }
  if (action.payload.formDataKey in state.formDataByKey) {
    if (action.type === REMOVE_FORM_CONTEXT_FORM_DATA) {
      console.log('❌❌❌❌❌❌❌❌❌❌'); // tslint:disable-line:no-console
      const formDataByKey = { ...state.formDataByKey };
      delete formDataByKey[action.payload.formDataKey];

      return {
        ...state,
        formDataByKey,
      };
    }

    console.log('----'); // tslint:disable-line:no-console
    if (action.type === CHANGE_FORM_CONTEXT_FORM_STATE) {
      const formDataByKey = { ...state.formDataByKey };
      const formData = { ...formDataByKey[action.payload.formDataKey] };

      const formState = {
        ...formData.formState,
        ...action.payload.partialFormState,
      };
      const formErrors = validate<typeof formState>(formData.schema.body, formState);
      const canSave = canSaveTest(formErrors);

      let partialFormStateToShow: object | string = action.payload.partialFormState;
      let formErrorsToShow: object | string = formErrors;

      if (!__DEVELOPMENT__) {
        partialFormStateToShow = JSON.stringify(partialFormStateToShow);
        formErrorsToShow = JSON.stringify(formErrorsToShow);
      }

      console.log('⚙️ FORM CHANGE FORM STATE', partialFormStateToShow); // tslint:disable-line:no-console
      console.log('⚙️ FORM CHANGE FORM ERRORS', formErrorsToShow); // tslint:disable-line:no-console
      console.log('⚙️ FORM CANSAVE', canSave); // tslint:disable-line:no-console

      formData.formState = formState;
      formData.formErrors = formErrors;
      formData.canSave = canSave;

      formDataByKey[action.payload.formDataKey] = formData;

      return {
        ...state,
        formDataByKey,
      };
    }

    if (action.type === CHANGE_FORM_CONTEXT_STORE) {
      const formDataByKey = { ...state.formDataByKey };
      const formData = { ...formDataByKey[action.payload.formDataKey] };
      formData.store = {
        ...formData.store,
        ...action.payload.partialStore,
      };

      let storeToShow: object | string = formData.store;

      if (!__DEVELOPMENT__) {
        storeToShow = JSON.stringify(storeToShow);
      }

      console.log('⚙️ FORM CHANGE STORE', storeToShow); // tslint:disable-line:no-console

      formDataByKey[action.payload.formDataKey] = formData;

      return {
        ...state,
        formDataByKey,
      };
    }
  }

  return state;
};
