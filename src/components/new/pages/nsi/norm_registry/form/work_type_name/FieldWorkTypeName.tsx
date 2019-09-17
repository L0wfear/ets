import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type Props = {
  formDataKey: 'norm';
};

const FieldWorkTypeName: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['work_type_name']>(props.formDataKey, 'work_type_name');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'work_type_name');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ work_type_name: value || null });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_work_type_name`}
        type="string"
        label='Способ уборки'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldWorkTypeName;
