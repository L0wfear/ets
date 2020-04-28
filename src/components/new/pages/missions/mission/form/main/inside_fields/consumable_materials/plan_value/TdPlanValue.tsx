import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { useMissionFormDataIsCompleted } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';

type Props = PropsToTdReactComponent;

const TdPlanValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const passes_count = useForm.useFormDataFormStatePickValue<Mission, Mission['passes_count']>(props.formDataKey, 'passes_count');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const municipal_facility_id = useForm.useFormDataFormStatePickValue<Mission, Mission['municipal_facility_id']>(props.formDataKey, 'municipal_facility_id');
    const municipalFacilityMeasureUnitList = etsUseSelector((state) => getSomeUniqState(state).municipalFacilityMeasureUnitList);
    const municipal_facility_measure_unit_name = get(municipalFacilityMeasureUnitList.find((rowData) => rowData.municipal_facility_id === municipal_facility_id), 'measure_unit_name');
    const IS_COMPLETED = useMissionFormDataIsCompleted(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                plan_value: get(event, 'target.value', event),
              };
            }

            return rowData;
          }),
        });
      },
      [handleChange, consumable_materials, props.indexRow],
    );

    const consumable_material_id = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_id');
      },
      [consumable_materials, props.indexRow],
    );
    const is_plan_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_plan_value_locked');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'plan_value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || is_plan_value_locked || !consumable_material_id || IS_COMPLETED;

    const value = React.useMemo(
      () => {
        if(disabled) {
          return get(consumable_materials[props.indexRow], 'plan_value') * passes_count;
        }
        return get(consumable_materials[props.indexRow], 'plan_value');
      },
      [consumable_materials, props.indexRow, passes_count],
    );

    return (
      <ExtField
        type="number"
        id={metaPlanValue.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled}
        addonRight={municipal_facility_measure_unit_name}
        value_string={value}
      />
    );
  },
);

export const metaPlanValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'plan_value',
  title: 'Объем работы (план)',
  format: 'string',
  width: 100,

  ReactComponentType: TdPlanValue,
};

export default TdPlanValue;
