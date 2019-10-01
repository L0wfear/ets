import * as React from 'react';
import { get } from 'lodash';
import { isObject, isNumber } from 'util';

import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { MISSION_STATUS } from 'redux-main/reducers/modules/missions/mission/constants';
import { actionConsumableMaterialCountMissionGetAndSetInStore, actionResetSetConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/actions';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

export const checkIsMissionNotComplete = (status: Mission['status']) => {
  return (
    status === MISSION_STATUS.not_assigned
    || status === MISSION_STATUS.assigned
    || status === MISSION_STATUS.in_progress
    || status === MISSION_STATUS.expired
  );
};
export const checkIsMissionComplete = (status: Mission['status']) => {
    return (
    status === MISSION_STATUS.complete
    || status === MISSION_STATUS.fail
    || status === MISSION_STATUS.canceled
  );
};

/**
 * IS_NOT_ASSIGN
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsNotAssign = (formDataKey: FormKeys) => {
  const status = useForm.useFormDataFormStatePickValue<Mission, Mission['status']>(formDataKey, 'status');

  return status === MISSION_STATUS.not_assigned;
};

/**
 * IS_ASSIGN
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsAssign = (formDataKey: FormKeys) => {
  const status = useForm.useFormDataFormStatePickValue<Mission, Mission['status']>(formDataKey, 'status');

  return status === MISSION_STATUS.assigned;
};

/**
 * IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsAssignWithNotActiveWaybill = (formDataKey: FormKeys, active: boolean) => {
  const IS_ASSIGN = useMissionFormDataIsAssign(formDataKey);
  const waybill_number = useForm.useFormDataFormStatePickValue<Mission, Mission['waybill_number']>(formDataKey, 'waybill_number');

  const bool = formDataKey === 'mission' ? !waybill_number : false;

  return (
    IS_ASSIGN
    && (!active ? bool : !bool)
  );
};

/**
 * IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsNotAssignOrIsAssignWithNotActiveWaybill = (formDataKey: FormKeys) => {
  const IS_NOT_ASSIGN = useMissionFormDataIsNotAssign(formDataKey);
  const IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL = useMissionFormDataIsAssignWithNotActiveWaybill(formDataKey, false);

  return (
    IS_NOT_ASSIGN
    || IS_ASSIGN_WITH_NOT_ACTIVE_WAYBILL
  );
};

/**
 * IS_NOT_COMPLETED
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsNoCompleted = (formDataKey: FormKeys) => {
  const status = useForm.useFormDataFormStatePickValue<Mission, Mission['status']>(formDataKey, 'status');

  return checkIsMissionNotComplete(status);
};

/**
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill = (formDataKey: FormKeys) => {
  const IS_NOT_COMPLETED = useMissionFormDataIsNoCompleted(formDataKey);
  const IS_ASSIGN_WITH_ACTIVE_WAYBILL = useMissionFormDataIsAssignWithNotActiveWaybill(formDataKey, true);

  return IS_NOT_COMPLETED || IS_ASSIGN_WITH_ACTIVE_WAYBILL;
};

/**
 * IS_COMPLETED
 * @param formDataKey FormKeys
 */
export const useMissionFormDataIsCompleted = (formDataKey: FormKeys) => {
  const status = useForm.useFormDataFormStatePickValue<Mission, Mission['status']>(formDataKey, 'status');

  return checkIsMissionComplete(status);

};

export const useMissionFormDataHandeChange = <F>(formDataKey: FormKeys) => {
  const handleChange = useMissionFormDataHandeToUpdateConsumableMaterials<Mission>(formDataKey);

  return React.useCallback(
    async (partialFormState: Partial<F> | keyof F, value?: F[keyof F]) => {
      if (isObject(partialFormState)) {
        await handleChange(partialFormState as Partial<F>);
      } else {
        const partialFormStateNew = {
          [partialFormState as keyof F]: get(value, 'target.value', value),
        };
        await handleChange(partialFormStateNew as Partial<F>);
      }
    },
    [handleChange],
  );
};

export const useMissionFormDataHandeToUpdateConsumableMaterials = <F extends Pick<Mission, 'consumable_materials'> & Record<string, any>>(formDataKey: FormKeys) => {
  const meta = useForm.useFormDataMeta(formDataKey);
  const handleChange = useForm.useFormDataHandleChange<F>(formDataKey);
  const formState = useForm.useFormDataFormState<F>(formDataKey);
  const dispatch = etsUseDispatch();
  const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);

  return React.useCallback(
    async (partialObj: Partial<F>) => {
      const newPartialFormState = {
        ...formState,
        ...partialObj,
      };

      const prev_norm_id = formDataKey === 'mission'
        ? (
            formState.norm_ids.length > 1
              ? null
              : formState.norm_ids[0]
        )
        : (
          formState.norm_id
        );

      const norm_id = formDataKey === 'mission'
        ? (
            newPartialFormState.norm_ids.length > 1
              ? null
              : newPartialFormState.norm_ids[0]
        )
        : (
          newPartialFormState.norm_id
        );

      const prev_municipal_facility_id = formState.municipal_facility_id;
      const date_start = newPartialFormState.date_start || newPartialFormState.fact_date_start || newPartialFormState.plan_date_start;
      const prev_date_start = formState.date_start || formState.fact_date_start || formState.plan_date_start;
      const prev_route_id = formState.route_id;

      const passes_count_number = Number(newPartialFormState.passes_count);
      const passes_count_prev_number = Number(formState.passes_count);
      const passes_count = (
        formDataKey === 'duty_mission'
          ? 1
          : !isNaN(passes_count_number) && passes_count_number > 0 && passes_count_number < 11
            ? passes_count_number
            : 1
      );
      const prev_passes_count = (
        formDataKey === 'duty_mission'
          ? 1
          : isNumber(passes_count_prev_number) && passes_count_prev_number > 0 && passes_count_prev_number < 11
            ? passes_count_prev_number
            : 1
      );

      const triggerOnReset = newPartialFormState.consumable_materials[0] && (
        !newPartialFormState.technical_operation_id
        || !newPartialFormState.municipal_facility_id
        || !date_start
        || !newPartialFormState.route_id
        || !norm_id
      );
      if (triggerOnReset) {
        try {
          if (!newPartialFormState.technical_operation_id || !newPartialFormState.municipal_facility_id) {
            await global.confirmDialog({
              title: 'Внимание!',
              body: formDataKey === 'mission'
                ? 'При изменении технологической операции или элемента будет обновлен список расходных материалов. Продолжить?'
                : '"При изменении технологической операции или элемента будет обновлен список расходных материалов. Продолжить?',
            });
          }
        } catch {
          return;
        }
        newPartialFormState.consumable_materials = [];
      }

      const triggerOnUpdate = Boolean(
        norm_id
          && newPartialFormState.municipal_facility_id
          && date_start
          && newPartialFormState.route_id
          && newPartialFormState.passes_count
          && passes_count
          && (
            norm_id !== prev_norm_id
            || newPartialFormState.municipal_facility_id !== prev_municipal_facility_id
            || date_start !== prev_date_start
            || newPartialFormState.route_id !== prev_route_id
            || newPartialFormState.passes_count !== newPartialFormState.passes_count
            || passes_count !== prev_passes_count
          ),
      );

      if (triggerOnUpdate) {
        const payload: Parameters<typeof actionConsumableMaterialCountMissionGetAndSetInStore>[0] = {
          type: formDataKey === 'mission' ? 'mission' : 'duty_mission',
          norm_id,
          municipal_facility_id: newPartialFormState.municipal_facility_id,
          date: date_start,
          route_id: newPartialFormState.route_id,
          passes_count,
        };
        if (newPartialFormState.id) {
          payload.mission_id = newPartialFormState.id;
        }
        if (newPartialFormState.order_operation_id) {
          payload.order_operation_id = newPartialFormState.order_operation_id;
        }
        const { data, dataIndex } = await dispatch(actionConsumableMaterialCountMissionGetAndSetInStore(payload, meta));

        if ((newPartialFormState.municipal_facility_id !== prev_municipal_facility_id || norm_id !== prev_norm_id || !prev_date_start || !prev_route_id) || passes_count !== passes_count_prev_number) {
          newPartialFormState.consumable_materials = data.map((rowData) => ({
            ...rowData,
          }));
        }

        const triggerOnUpdateConsumableMaterials = (
          (prev_date_start && (prev_date_start !== date_start))
          || (prev_route_id && (prev_route_id !== newPartialFormState.route_id))
        );

        if (triggerOnUpdateConsumableMaterials) {
          newPartialFormState.consumable_materials = (newPartialFormState.consumable_materials as ConsumableMaterialCountMission[]).reduce(
            (newArr, rowData) => {
              if (dataIndex[rowData.consumable_material_id]) {
                newArr.push({
                  ...dataIndex[rowData.consumable_material_id],
                });
              }

              return newArr;
            },
            [],
          );
        }
      }

      if (Boolean(consumableMateriaForMission[0]) && (!norm_id || !newPartialFormState.route_id || !newPartialFormState.municipal_facility_id || !date_start)) {
        dispatch(actionResetSetConsumableMaterialCountMission());
      }

      handleChange(newPartialFormState);
    },
    [
      Boolean(consumableMateriaForMission[0]),
      handleChange,
      formState,
    ],
  );
};
