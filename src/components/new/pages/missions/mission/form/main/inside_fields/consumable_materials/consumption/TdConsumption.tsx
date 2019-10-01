import * as React from 'react';
import { get } from 'lodash';

import { PropsToTdReactComponent, TableMeta } from 'components/new/ui/table_input/TableInput';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill } from 'components/@next/@form/hook_selectors/mission/useMissionFormData';

type Props = PropsToTdReactComponent;

const TdConsumption: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Mission>(props.formDataKey);
    const consumable_materials = useForm.useFormDataFormStatePickValue<Mission, Mission['consumable_materials']>(props.formDataKey, 'consumable_materials');
    const isPermitted = useForm.useFormDataIsPermitted<Mission>(props.formDataKey);
    const IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_ACTIVE_WAYBILL = useMissionFormDataIsNotAssignOrIsAssignWithActiveWaybill(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        handleChange({
          consumable_materials: consumable_materials.map((rowData, index) => {
            if (index === props.indexRow) {
              return {
                ...rowData,
                consumption: get(event, 'target.value', event),
                plan_value: rowData.plan_value || 0,
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
        return get(consumable_materials[props.indexRow], 'consumption');
      },
      [consumable_materials, props.indexRow],
    );

    const errors = useForm.useFormDataFormErrorsPickValue<Mission, Array<any>>(props.formDataKey, 'consumable_materials');
    const error = React.useMemo(
      () => {
        return get(errors[props.indexRow], 'consumption');
      },
      [errors, props.indexRow],
    );

    const disabled = !isPermitted || !IS_NOT_ASSIGN_OR_IS_ASSIGN_WITH_ACTIVE_WAYBILL;

    return (
      <ExtField
        type="string"
        id={metaConsumption.key}
        label={false}
        value={value}
        error={error}
        onChange={handleChangeWrap}
        disabled={disabled}
      />
    );
  },
);

export const metaConsumption: TableMeta<ValuesOf<Mission['consumable_materials']>> = {
  key: 'consumption',
  title: 'Расход (итого)',
  format: 'string',
  width: 100,

  ReactComponentType: TdConsumption,
};

export default TdConsumption;
