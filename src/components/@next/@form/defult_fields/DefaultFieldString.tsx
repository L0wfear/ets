import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

type Props<F extends Record<string, any>> = {
  field_name: AllowedNames<F, string | number>;
  name: string;

  disabled?: boolean;
  formDataKey: FormKeys;
};

const DefaultFieldString = <F extends Record<string, any>>(props: Props<F>): React.ReactElement => {
  const { formDataKey } = props;
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
      id={`${formDataKey}_${props.field_name}`}
      type="string"
      label={props.name}
      value={formStateValue}
      error={error}
      onChange={handleChangeWrap}
      disabled={!isPermitted || props.disabled}
    />
  );
};

// export default React.memo(DefaultFieldString);
export default DefaultFieldString;
