import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type Props = PropsToTdReactComponent;

const TdPlanValue: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);

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

    const value = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'plan_value');
      },
      [consumable_materials, props.indexRow],
    );

    const is_plan_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_plan_value_locked');
      },
      [consumable_materials, props.indexRow],
    );

    const is_fact_value_locked = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'is_fact_value_locked');
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

    const disabled = !isPermitted || is_fact_value_locked || !is_plan_value_locked;

    return (
      <ExtField
        type="string"
        id={metaPlanValue.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled}
      />
    );
  },
);

export const metaPlanValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'plan_value',
  title: 'Объем работ (план)',
  format: 'string',
  width: 100,

  ReactComponentType: TdPlanValue,
};

export default TdPlanValue;
