import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';

type Props<F extends Record<string, any>> = {
  field_name: AllowedNames<F, number>;
  field_label?: AllowedNames<F, string>;
  name: string;

  disabled?: boolean;
  formDataKey: FormKeys;

  hookGetOptionsData: (meta: LoadingMeta) => { isLoading: boolean; options: Array<{ value: number; label: string; }>}
  clearable?: boolean;
  multi?: boolean;
};

const DefaultFieldSelect = <F extends Record<string, any>>(props: Props<F>): React.ReactElement => {
  const { formDataKey } = props;
  const meta = useForm.useFormDataMeta<F>(props.formDataKey);
  const formStateValue = useForm.useFormDataFormStatePickValue<F, string>(props.formDataKey, props.field_name);
  const value_string = useForm.useFormDataFormStatePickValue<F, string>(props.formDataKey, props.field_name);
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

  const optionsData = props.hookGetOptionsData(meta);

  return (
    <ExtField
      id={`${formDataKey}_${props.field_name}`}
      type="select"
      clearable={props.clearable}
      multi={props.multi}
      label={props.name}
      value={formStateValue}
      error={error}
      options={optionsData.options}
      onChange={handleChangeWrap}
      disabled={!isPermitted || props.disabled}

      etsIsLoading={optionsData.isLoading}
      value_string={value_string}
    />
  );
};

// export default React.memo(DefaultFieldSelect);
export default DefaultFieldSelect;
