import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FuelOperationActive } from 'redux-main/reducers/modules/fuel_operations/@types/fuelOperations';

type Props = {
  formDataKey: 'fuel_operations';
};

const FieldName: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<FuelOperationActive>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<FuelOperationActive, FuelOperationActive['name']>(props.formDataKey, 'name');
    const error = useForm.useFormDataFormErrorsPickValue<FuelOperationActive, string>(props.formDataKey, 'name');
    const handleChange = useForm.useFormDataHandleChange<FuelOperationActive>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<FuelOperationActive>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ name: value || null });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_name`}
        type="string"
        label='Операция'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldName;
