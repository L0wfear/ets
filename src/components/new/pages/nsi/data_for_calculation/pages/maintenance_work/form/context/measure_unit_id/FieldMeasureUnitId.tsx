import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import useMeasureUnitOptions from 'components/new/utils/hooks/services/useOptions/useMeasureUnitOptions';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';

type Props = {
  formDataKey: string;
};

const FieldMeasureUnitId: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<MaintenanceWork>(props.formDataKey);
    const measure_unit_id = useForm.useFormDataFormStatePickValue<MaintenanceWork, MaintenanceWork['measure_unit_id']>(props.formDataKey, 'measure_unit_id');
    const measure_unit_name = useForm.useFormDataFormStatePickValue<MaintenanceWork, MaintenanceWork['measure_unit_name']>(props.formDataKey, 'measure_unit_name');
    const formErrors = useForm.useFormDataFormErrors<MaintenanceWork>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<MaintenanceWork>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<MaintenanceWork>(props.formDataKey);

    const measureUnitOptionsData = useMeasureUnitOptions();

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
        id={`${path}_measure_unit_id`}
        type="select"
        clearable={false}
        label="Единица измерения "
        value={measure_unit_id}
        error={formErrors.measure_unit_id}
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
