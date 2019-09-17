import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type Props<F extends Record<string, any>> = {
  field_name: keyof F;
  fild_label: string;

  disabled?: boolean;
  formDataKey: (
    'fuel_operations'
    | 'consumable_material'
    | 'maintenance_work'
    | 'norm'
  );
};

const DefaultFieldString = <F extends Record<string, any>>(props: Props<F>): React.ReactElement => {
  const { path } = useForm.useFormDataMeta<F>(props.formDataKey);
  const formStateValue = useForm.useFormDataFormStatePickValue<F, string>(props.formDataKey, props.field_name);
  const error = useForm.useFormDataFormErrorsPickValue<F, string>(props.formDataKey, props.field_name);
  const handleChange = useForm.useFormDataHandleChange<F>(props.formDataKey);
  const isPermitted = useForm.useFormDataIsPermitted<F>(props.formDataKey);

  const handleChangeWrap = React.useCallback(
    (event) => {
      const value: F[keyof F] = get(event, 'target.value', event) || null;
      const partialData: Partial<Record<keyof F, any>> = {};
      partialData[props.field_name] = value;

      handleChange(partialData);
    },
    [handleChange, props.field_name],
  );

  return (
    <ExtField
      id={`${path}_${props.field_name}`}
      type="string"
      label={props.fild_label}
      value={formStateValue}
      error={error}
      onChange={handleChangeWrap}
      disabled={!isPermitted || props.disabled}
    />
  );
};

// export default React.memo(DefaultFieldString);
export default DefaultFieldString;
