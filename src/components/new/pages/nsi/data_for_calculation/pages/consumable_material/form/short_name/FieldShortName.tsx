import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';

import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { ConsumableMaterial } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';

type Props = {
  formDataKey: FormKeys;
};

const FieldShortName: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<ConsumableMaterial>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<ConsumableMaterial, ConsumableMaterial['short_name']>(props.formDataKey, 'short_name');
    const error = useForm.useFormDataFormErrorsPickValue<ConsumableMaterial, string>(props.formDataKey, 'short_name');

    const handleChange = useForm.useFormDataHandleChange<ConsumableMaterial>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<ConsumableMaterial>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ short_name: value || null });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_short_name`}
        type="string"
        label='Сокращенное наименование'
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldShortName;
