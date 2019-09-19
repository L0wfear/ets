import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

type Props = {
  formDataKey: 'fuel_operations';
};

const FieldEquipment: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<FuelOperationActive>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<FuelOperationActive, FuelOperationActive['equipment']>(props.formDataKey, 'equipment');
    const error = useForm.useFormDataFormErrorsPickValue<FuelOperationActive, string>(props.formDataKey, 'equipment');
    const handleChange = useForm.useFormDataHandleChange<FuelOperationActive>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<FuelOperationActive>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.checked', event);
        handleChange({ equipment: Boolean(value || null) });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_equipment`}
        type="boolean"
        label="Для спецоборудования"
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
        className="checkbox-input flex-reverse"
      />
    );
  },
);

export default FieldEquipment;
