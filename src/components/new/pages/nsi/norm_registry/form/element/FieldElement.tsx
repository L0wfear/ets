import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';

type Props = {
  formDataKey: 'norm';
};

const FieldElement: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['elements_text']>(props.formDataKey, 'elements_text');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'elements_text');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ elements_text: value || null });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_elements_text`}
        type="string"
        label='Элемент'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldElement;
