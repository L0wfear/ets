import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';

import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';

type Props = {
  formDataKey: 'consumable_material';
};

const FieldName: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<ConsumableMaterial>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['name']>(props.formDataKey, 'name');
    const error = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, string>(props.formDataKey, 'name');
    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

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
        label='Наименование'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldName;
