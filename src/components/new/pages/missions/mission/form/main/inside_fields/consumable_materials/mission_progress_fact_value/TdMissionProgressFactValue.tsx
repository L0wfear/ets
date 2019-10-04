import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';

type Props = PropsToTdReactComponent;

const TdMissionProgressFactValue: React.FC<Props> = React.memo(
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
                mission_progress_fact_value: get(event, 'target.value', event),
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
        return get(consumable_materials[props.indexRow], 'mission_progress_fact_value');
      },
      [consumable_materials, props.indexRow],
    );
    const consumable_material_measure_unit_name = React.useMemo(
      () => {
        return get(consumable_materials[props.indexRow], 'consumable_material_measure_unit_name');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'mission_progress_fact_value');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted;

    return (
      <ExtField
        type="number"
        id={metaMissionProgressFactValue.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled || true}
        addonRight={consumable_material_measure_unit_name}
      />
    );
  },
);

export const metaMissionProgressFactValue: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'mission_progress_fact_value',
  title: 'Объем работ (ГЛОНАСС)',
  format: 'string',
  width: 100,

  ReactComponentType: TdMissionProgressFactValue,
};

export default TdMissionProgressFactValue;
