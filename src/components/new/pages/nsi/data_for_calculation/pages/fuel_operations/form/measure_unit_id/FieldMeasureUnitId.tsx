import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useMeasureUnitOperationOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOperationOptions';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

type Props = {
  formDataKey: 'fuel_operations';
};

const FieldMeasureUnitId: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<FuelOperationActive>(props.formDataKey);
    const measure_unit_id = useForm.useFormDataFormStatePickValue<FuelOperationActive, FuelOperationActive['measure_unit_id']>(props.formDataKey, 'measure_unit_id');
    const measure_unit_name = useForm.useFormDataFormStatePickValue<FuelOperationActive, FuelOperationActive['measure_unit_name']>(props.formDataKey, 'measure_unit_name');
    const error = useForm.useFormDataFormErrorsPickValue<FuelOperationActive, string>(props.formDataKey, 'measure_unit_id');
    const handleChange = useForm.useFormDataHandleChange<FuelOperationActive>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<FuelOperationActive>(props.formDataKey);

    const measureUnitOptionsData = useMeasureUnitOperationOptions(meta);

    const options = React.useMemo(
      () => {
        if (measure_unit_id && !measureUnitOptionsData.options.find(({ value }) => value === measure_unit_id)) {
          return [
            ...measureUnitOptionsData.options,
            { value: measure_unit_id, label: measure_unit_name },
          ];
        }

        return measureUnitOptionsData.options;
      },
      [measure_unit_id, measure_unit_name, measureUnitOptionsData],
    );

    const handleChangeWrap = React.useCallback(
      (newValue, option) => {
        handleChange({
          measure_unit_id: newValue,
          measure_unit_name: get(option, 'rowData.name', null),
        });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${meta.path}_measure_unit_id`}
        type="select"
        clearable={false}
        label="Единица измерения "
        value={measure_unit_id}
        error={error}
        options={options}
        onChange={handleChangeWrap}
        disabled={!isPermitted}

        etsIsLoading={measureUnitOptionsData.isLoading}
        value_string={measure_unit_name}
      />
    );
  },
);

export default FieldMeasureUnitId;
