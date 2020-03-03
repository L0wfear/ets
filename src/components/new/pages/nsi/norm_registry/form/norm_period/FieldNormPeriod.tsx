import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type Props = {
  formDataKey: 'norm';
};

const FieldNormPeriod: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const norm_period = useForm.useFormDataFormStatePickValue<Norm, Norm['norm_period']>(props.formDataKey, 'norm_period');
    const period_interval_name = useForm.useFormDataFormStatePickValue<Norm, Norm['period_interval_name']>(props.formDataKey, 'period_interval_name');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'norm_period');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ norm_period: value || null });
      },
      [handleChange],
    );

    const formStateValue = (
      period_interval_name
        ? `${norm_period} в ${period_interval_name}`
        : norm_period
    );

    return (
      <ExtField
        id={`${path}_norm_period`}
        type="string"
        label='Число операций в сутки (норматив)'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldNormPeriod;
