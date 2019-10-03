import { cloneDeep } from 'lodash';
import { isObject, isNullOrUndefined, isArray } from 'util';

import { EtsAction } from 'components/@next/ets_hoc/etsUseDispatch';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import { validate, canSaveTest} from 'components/@next/@form/validate/validate';
import { getFormDataByKey } from 'redux-main/reducers/modules/form_data_record/selectors';
import { FORM_SET_DATA, FORM_REMOVE_DATA, FORM_CHANGE_DATA } from 'redux-main/reducers/modules/form_data_record/form_data_record_reducer';
import { OneFormDataByKey, FormKeys, ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { getSessionState } from 'redux-main/reducers/selectors';
import { validatePermissions } from 'components/@next/@utils/validate_permissions/validate_permissions';
import { metaMaintenanceWork } from 'redux-main/reducers/modules/form_data_record/form_data/maintenance_work/form_meta';
import { metaInspectOneActScan } from 'redux-main/reducers/modules/form_data_record/form_data/inspect_one_act_scan/form_meta';
import { metaConsumableMaterial } from 'redux-main/reducers/modules/form_data_record/form_data/consumable_material/form_meta';
import { metaNorm } from 'redux-main/reducers/modules/form_data_record/form_data/norm/form_meta';
import { createValidDate, createValidDateTime } from 'components/@next/@utils/dates/dates';
import { defaultAction } from 'redux-main/default.actions';
import { SchemaFormContextBody } from 'components/@next/@form/@types';
import { metaCleaningAreaRate } from 'redux-main/reducers/modules/form_data_record/form_data/cleaning_area_rate/form_meta';
import { metaFuelOperations } from 'redux-main/reducers/modules/form_data_record/form_data/fuel_operations/form_meta';
import { metaCleaningRate } from 'redux-main/reducers/modules/form_data_record/form_data/cleaning_rate/form_meta';
import { metaMission } from 'redux-main/reducers/modules/form_data_record/form_data/mission/form_meta';
import etsLoadingCounter from 'redux-main/_middleware/ets-loading/etsLoadingCounter';
import { metaDutyMission } from 'redux-main/reducers/modules/form_data_record/form_data/duty_mission/form_meta';

export const removeEmptyString = <F extends Record<string, any>>(formState: F) => {
  Object.keys(formState).forEach((key: keyof F) => {
    if (formState[key] === '') {
      formState[key] = null;
      return;
    }

    if (isArray(formState[key]) && isObject(formState[key][0])) {
      formState[key].forEach((obj) => {
        removeEmptyString(obj);
      });
    }
    if (isObject(formState[key])) {
      removeEmptyString(formState[key]);
      return;
    }
  });
};

export const getFormatedValue = <F extends Record<string, any>>(fieldMetaData: SchemaFormContextBody<F>['validate_fields'][any], value: any, strick?: boolean) => {
  if (fieldMetaData) {
    switch (fieldMetaData.type) {
      case 'number':
        if (strick) { // При сабмите преобразует в число, данная функция вызываается в handleChange
          return value ? Number(value) : null;
        }
        const valueNumberString = value;

        if (valueNumberString || valueNumberString === 0) {
          const valueReplaced = valueNumberString.toString().replace(/,/g, '.');
          if (!isNaN(Number(valueReplaced))) {
            if (valueReplaced.match(/^\.\d*$/)) {
              return `0${valueReplaced}`;
            }
          }
          return valueReplaced;
        } else {
          return null;
        }
      case 'string':
      case 'boolean':
        return value;
      case 'date':
        return createValidDate(value);
      case 'datetime':
        return createValidDateTime(value);
      default:
        return Boolean(value) || value === 0 ? value : null;
    }
  }

  return value;
};

export const mapFormMeta: { [K in FormKeys]: ConfigFormData<any> } = {
  maintenance_work: metaMaintenanceWork,
  inspect_one_act_scan: metaInspectOneActScan,
  consumable_material: metaConsumableMaterial,
  norm: metaNorm,
  cleaning_area_rate: metaCleaningAreaRate,
  fuel_operations: metaFuelOperations,
  cleaning_rate: metaCleaningRate,
  mission: metaMission,
  duty_mission: metaDutyMission,
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

export const actionUpdateFormErrors = <F extends Record<string, any>>(formKey: FormKeys): EtsAction<Promise<any>> => async (dispatch, getState) => {
  const formMeta = mapFormMeta[formKey] as ConfigFormData<F>;
  const formDataOld = getFormDataByKey<F>(getState(), formKey);

  if (formDataOld) {
    const formData = { ...formDataOld };

    const formErrors = validate<F>(formMeta.schema.body.validate_fields, formData.formState, getState());
    const canSave = canSaveTest(formErrors);

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

export const actionSubmitFormState = <F extends Record<string, any>>(formKey: FormKeys, ...arg: any[]): EtsAction<Promise<any>> => async (dispatch, getState) => {
  const formMeta = mapFormMeta[formKey] as ConfigFormData<F>;
  const formData = getFormDataByKey<F>(getState(), formKey);

  if (formData) {
    const formState = cloneDeep(formData.formState);

    Object.entries(formMeta.schema.body.validate_fields).forEach(
      (validateFieldEntrie) => {
        const key: keyof F = validateFieldEntrie[0];
        const validateFieldData = validateFieldEntrie[1];

        formState[key] = getFormatedValue(validateFieldData, formState[key], true);

      },
    );

    removeEmptyString(formState);

    return dispatch(
      defaultAction(
        formMeta.handleSubmitPromise(formState, ...arg),
        {
          ...formData.meta,
          noTimeout: true,
        },
      ),
    );
  }
};

export const actionChangeFormState = <F extends Record<string, any>>(formKey: FormKeys, partialFormState: Partial<F>): EtsAction<any> => (dispatch, getState) => {
  const formMeta = mapFormMeta[formKey] as ConfigFormData<F>;
  const formDataOld = getFormDataByKey<F>(getState(), formKey);

  if (formDataOld) {
    const formData = { ...formDataOld };
    const formState = {
      ...formData.formState,
      ...partialFormState,
    };

    Object.entries(partialFormState).forEach(
      (formStateData) => {
        const key: keyof F = formStateData[0];
        const value = formStateData[1];
        const fieldMetaData = formMeta.schema.body.validate_fields[key];

        formState[key] = getFormatedValue(fieldMetaData, value);
      },
    );

    const formErrors = validate<F>(formMeta.schema.body.validate_fields, formState, getState());
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

  const formErrors = validate<F>(formMeta.schema.body.validate_fields, formState, getState());
  const canSave = canSaveTest(formErrors);

  dispatch(
    actionAddForm<F>(
      formKey,
      {
        formState,
        originalFormState: formState,
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

export const actionGetInitialFormState = <F extends Record<string, any>>(formKey: FormKeys, element: F, meta: LoadingMeta): EtsAction<Promise<F>> => async (dispatch, getState) => {
  const formMeta = mapFormMeta[formKey] as ConfigFormData<F>;
  const uniqField =  formMeta.uniqField;

  let formState = element;
  const id = element[uniqField];

  if (formMeta.getOneRecordPromise && id) {
    formState = await etsLoadingCounter(
      dispatch,
      formMeta.getOneRecordPromise(id),
      meta,
    );
  }

  if ((formMeta as ConfigFormData<F & { structure_id: number; structure_name: string }>).user_structure_on_new) {
    const userData = getSessionState(getState()).userData;
    const formStateExtends = formState as F & { structure_id: number; structure_name: string };
    if (!id) {
      formStateExtends.structure_id = formState.structure_id || userData.structure_id;
      formStateExtends.structure_name = formState.structure_name || userData.structure_name;
    }
  }

  const defFormState = cloneDeep(formMeta.getDefaultElement(getState()));

  if (isObject(formState)) {
    Object.keys(defFormState).forEach((key: keyof F) => {
      defFormState[key] = !isNullOrUndefined(formState[key]) ? formState[key] : cloneDeep(defFormState[key]);
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
