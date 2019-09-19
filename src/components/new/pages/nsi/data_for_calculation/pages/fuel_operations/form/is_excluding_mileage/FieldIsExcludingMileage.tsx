import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

type Props = {
  formDataKey: 'fuel_operations';
};

const FieldIsExcludingMileage: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<FuelOperationActive>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<FuelOperationActive, FuelOperationActive['is_excluding_mileage']>(props.formDataKey, 'is_excluding_mileage');
    const error = useForm.useFormDataFormErrorsPickValue<FuelOperationActive, string>(props.formDataKey, 'is_excluding_mileage');
    const handleChange = useForm.useFormDataHandleChange<FuelOperationActive>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<FuelOperationActive>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.checked', event);
        handleChange({ is_excluding_mileage: Boolean(value || null) });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_is_excluding_mileage`}
        type="boolean"
        label="Без учета пробега"
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
        className="checkbox-input flex-reverse"
      />
    );
  },
);

export default FieldIsExcludingMileage;
