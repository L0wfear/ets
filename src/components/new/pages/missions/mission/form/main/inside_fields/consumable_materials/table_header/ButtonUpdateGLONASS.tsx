import * as React from 'react';
import { keyBy } from 'lodash';

import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { etsUseSelector, etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { actionConsumableMaterialCountMissionGetAndSetInStore } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/actions';
import { mergeConsumableMaterials } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';

type Props = {
  buttonWidth: number;

  formDataKey: FormKeys & ('mission' | 'duty_mission');
};

const ButtonUpdateGLONASS: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const consumableMateriaForMission = etsUseSelector((state) => getSomeUniqState(state).consumableMaterialCountMissionList);

    const missiom_norm_ids = useForm.useFormDataFormStatePickValue<Mission, Mission['norm_ids']>(props.formDataKey, 'norm_ids');
    const municipal_facility_id = useForm.useFormDataFormStatePickValue<Mission, Mission['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const date_start = useForm.useFormDataFormStatePickValue<Mission, Mission['date_start']>(props.formDataKey, 'date_start');
    const route_id = useForm.useFormDataFormStatePickValue<Mission, Mission['route_id']>(props.formDataKey, 'route_id');
    const id = useForm.useFormDataFormStatePickValue<Mission, Mission['id']>(props.formDataKey, 'id');
    const order_operation_id = useForm.useFormDataFormStatePickValue<Mission, Mission['order_operation_id']>(props.formDataKey, 'order_operation_id');
    const passes_count = useForm.useFormDataFormStatePickValue<Mission, Mission['passes_count']>(props.formDataKey, 'passes_count');

    const norm_id = React.useMemo(
      () => {
        if (props.formDataKey === 'mission') {
          return missiom_norm_ids[0];
        }

      },
      [missiom_norm_ids, props.formDataKey],
    );

    const dispatch = etsUseDispatch();
    const handleUpdateConsumptionMaterial = React.useCallback(
      async () => {
        const passes_count_number = Number(passes_count);
        const payload: Parameters<typeof actionConsumableMaterialCountMissionGetAndSetInStore>[0] = {
          type: 'mission',
          norm_id,
          municipal_facility_id,
          date: date_start,
          route_id,
          passes_count: (
            Boolean(!isNaN(passes_count_number) && passes_count_number > 0 && passes_count_number < 11)
              ? passes_count_number
              : 1
          ),
        };

        if (id) {
          payload.mission_id = id;
        }
        if (order_operation_id) {
          payload.order_operation_id = order_operation_id;
        }

        const { dataIndex: dataIndexRaw } = await dispatch(actionConsumableMaterialCountMissionGetAndSetInStore(payload, meta));
        const consumable_materials_index = keyBy(consumable_materials, 'consumable_material_id');
        const dataIndex = Object.fromEntries(
          Object.entries(dataIndexRaw).map(([key, data]) => {
            if (key in consumable_materials_index) {
              return [
                key,
                {
                  ...data,
                  is_fact_value_locked: consumable_materials_index[key].is_fact_value_locked,
                  is_plan_value_locked: consumable_materials_index[key].is_plan_value_locked,
                  is_consumption_locked: consumable_materials_index[key].is_plan_value_locked,
                },
              ];
            }

            return [key, data];
          }),
        );

        handleChange({
          consumable_materials: mergeConsumableMaterials(consumable_materials, dataIndex, props.formDataKey, ),
        });
      },
      [consumable_materials, passes_count, consumableMateriaForMission, norm_id, municipal_facility_id, id, order_operation_id, date_start, route_id],
    );

    const canUpdate = (
      Boolean(
        consumable_materials[0]
        && norm_id
        && municipal_facility_id
        && date_start
        && route_id,
      )
    );

    return (
      <ButtonTableInput
        block
        width={props.buttonWidth}
        onClick={handleUpdateConsumptionMaterial}
        disabled={!canUpdate}
      >
        Обновить ГЛОНАСС
      </ButtonTableInput>
    );
  },
);

export default ButtonUpdateGLONASS;
