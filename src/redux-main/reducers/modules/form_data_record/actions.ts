import { get } from 'lodash';

import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validate, canSaveTest} from 'components/@next/@form/validate/validate';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { FORM_SET_DATA, FORM_REMOVE_DATA, FORM_CHANGE_DATA } from 'redux-main/reducers/modules/form_data_record/form_data_record_reducer';
import { OneFormDataByKey } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export type OneFormDataByKeyForAdd<F extends object, Store extends object> = (
  Pick<
    OneFormDataByKey<F, Store>,
    'bsSizeForm'
    | 'handleSubmitPromise'
    | 'handleHide'
    | 'key'
    | 'meta'
    | 'permissions'
    | 'store'
    | 'uniqField'
    | 'schema'
  > & {
    mergeElement: (element: Partial<F>, sessionData: InitialStateSession) => F;   // функция получения нужного для формы элемента
    handleSubmitPromise: (formState: F) => Promise<F>;                            // промис создания/ сохранения
    loadItemPromise?: <K extends keyof F>(id: F[K]) => Promise<F>;                // Получениче данных по одному элементу
  }
);

export const actionAddForm = <F extends object, Store extends object>(formData: OneFormDataByKey<F, Store>) => ({
  type: FORM_SET_DATA,
  payload: {
    formData,
  },
});

export const actionRemoveFormData = <F extends object, Store extends object>(key: OneFormDataByKey<F, Store>['key']) => ({
  type: FORM_REMOVE_DATA,
  payload: {
    key,
  },
});

export const actionChangeFormData = <F extends object, Store extends object>(formData: OneFormDataByKey<F, Store>) => ({
  type: FORM_CHANGE_DATA,
  payload: {
    formData,
  },
});

export const actionChangeFormState = <F extends object, Store extends object>(key: OneFormDataByKey<F, Store>['key'], partialFormState: Partial<F>): EtsAction<any> => (dispatch, getState) => {
  const formDataOld = getFormDataByKey(getState(), key);

  if (formDataOld) {
    const formData = { ...formDataOld };
    const formState = {
      ...formData.formState,
      ...partialFormState,
    };
    const formErrors = validate<F>(formData.schema.body, formState as F);
    const canSave = canSaveTest(formErrors);

    formData.formState = formState;
    formData.formErrors = formErrors;
    formData.canSave = canSave;

    dispatch(
      actionChangeFormData(
        formData,
      ),
    );
  }
};

export const actionChangeFormStore = <F extends object, Store extends object>(key: OneFormDataByKey<F, Store>['key'], partialStore: Partial<Store>): EtsAction<any> => (dispatch, getState) => {
  const formDataOld = getFormDataByKey(getState(), key);
  if (formDataOld) {
    const formData = {
      ...formDataOld,
      store: {
        ...formDataOld.store,
        ...partialStore,
      },
    };

    dispatch(
      actionChangeFormData(
        formData,
      ),
    );
  }
};

export const actionInitialForm = <F extends object, Store extends object, InputElement extends object & F>(formDataForAdd: OneFormDataByKeyForAdd<F, Store>, element: InputElement, meta: LoadingMeta): EtsAction<Promise<void>> => async (dispatch, getState) => {
  const {
    mergeElement,
    loadItemPromise,
    ...formData
  } = formDataForAdd;

  const uniqField =  get(formDataForAdd, 'uniqField', 'id') as keyof F;
  const IS_CREATING = !get(element, uniqField, false);
  let new_element = null;

  if (!IS_CREATING && loadItemPromise) {
    try {
      new_element = await etsLoadingCounter(
        dispatch,
        formDataForAdd.loadItemPromise(element[uniqField]),
        meta,
      );
    } catch (e) {
      global.NOTIFICATION_SYSTEM.notify('Выбранная запись не найдена', 'info', 'tr');
      return;
    }
  } else {
    new_element = element;
  }

  const sessionState = getSessionState(getState());
  const permissionsSet = sessionState.userData.permissionsSet;

  const formState = mergeElement(new_element, sessionState);
  const formErrors = validate<F>(formDataForAdd.schema.body, formState);
  const canSave = canSaveTest(formErrors);

  dispatch(
    actionAddForm<F, Store>({
      ...formData,
      IS_CREATING,
      uniqField,
      isPermittedToCreate: validatePermissions(formDataForAdd.permissions.create, permissionsSet),
      isPermittedToUpdate: validatePermissions(formDataForAdd.permissions.update, permissionsSet),

      formState,
      formErrors,
      canSave,
    }),
  );
};
