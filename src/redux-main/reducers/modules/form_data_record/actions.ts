import { cloneDeep } from 'lodash';
import { isObject, isNullOrUndefined } from 'util';

import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { validate, canSaveTest} from 'components/@next/@form/validate/validate';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { FORM_SET_DATA, FORM_REMOVE_DATA, FORM_CHANGE_DATA } from 'redux-main/reducers/modules/form_data_record/form_data_record_reducer';
import { OneFormDataByKey, FormKeys, ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { metaMaintenanceWork } from 'redux-main/reducers/modules/form_data_record/form_data/maintenance_work/form_meta';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { metaInspectOneActScan } from 'redux-main/reducers/modules/form_data_record/form_data/inspect_one_act_scan/form_meta';

export const mapFormMeta: { [K in FormKeys]: ConfigFormData<any> } = {
  maintenance_work: metaMaintenanceWork,
  inspect_one_act_scan: metaInspectOneActScan,
};

export const actionAddForm = <F extends Record<string, any>>(formKey: FormKeys, formData: OneFormDataByKey<F>) => ({
  type: FORM_SET_DATA,
  payload: {
    formKey,
    formData,
  },
});

export const actionRemoveFormData = <F extends Record<string, any>>(formKey: FormKeys) => ({
  type: FORM_REMOVE_DATA,
  payload: {
    formKey,
  },
});

export const actionChangeFormData = <F extends Record<string, any>>(formKey: FormKeys, formData: OneFormDataByKey<F>) => ({
  type: FORM_CHANGE_DATA,
  payload: {
    formKey,
    formData,
  },
});

export const actionChangeFormState = <F extends Record<string, any>>(formKey: FormKeys, partialFormState: Partial<F>): EtsAction<any> => (dispatch, getState) => {
  const formDataOld = getFormDataByKey<F>(getState(), formKey);

  if (formDataOld) {
    const formData = { ...formDataOld };
    const formState = {
      ...formData.formState,
      ...partialFormState,
    };
    const formErrors = validate<F>(mapFormMeta[formKey].schema.body, formState);
    const canSave = canSaveTest(formErrors);

    formData.formState = formState;
    formData.formErrors = formErrors;
    formData.canSave = canSave;

    dispatch(
      actionChangeFormData(
        formKey,
        formData,
      ),
    );
  }
};

const actionInitialForm = <F extends Record<string, any>>(formKey: FormKeys, formState: F, meta: LoadingMeta): EtsAction<void> => (dispatch, getState) => {
  const formMeta = mapFormMeta[formKey] as ConfigFormData<F>;

  const uniqField =  formMeta.uniqField;
  const IS_CREATING = !formState[uniqField];

  const sessionState = getSessionState(getState());
  const permissionsSet = sessionState.userData.permissionsSet;

  const formErrors = validate<F>(formMeta.schema.body, formState);
  const canSave = canSaveTest(formErrors);

  dispatch(
    actionAddForm<F>(
      formKey,
      {
        formState,
        formErrors,
        IS_CREATING,
        canSave,

        meta,
        isPermittedToCreate: validatePermissions(formMeta.permissions.create, permissionsSet),
        isPermittedToUpdate: validatePermissions(formMeta.permissions.update, permissionsSet),
      },
    ),
  );
};

export const actionGetInitialFormState = <F>(formKey: FormKeys, element: F, meta: LoadingMeta): EtsAction<Promise<F>> => async (dispatch) => {
  const defFormState = cloneDeep((mapFormMeta[formKey] as ConfigFormData<F>).default_element);

  if (isObject(element)) {
    Object.keys(defFormState).forEach((key) => {
      defFormState[key] = !isNullOrUndefined(element[key]) ? element[key] : defFormState[key];
    });
  }

  return Promise.resolve(defFormState);
};

export const actionInitialFormByKey = <F>(formKey: FormKeys, element: F, meta: LoadingMeta): EtsAction<any> => async (dispatch) => {
  const formState = await dispatch(
    actionGetInitialFormState<F>(
      formKey,
      element,
      meta,
    ),
  );

  dispatch(
    actionInitialForm(
      formKey,
      formState,
      meta,
    ),
  );
};
