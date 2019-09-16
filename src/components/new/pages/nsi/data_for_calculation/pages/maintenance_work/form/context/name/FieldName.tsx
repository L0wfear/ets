import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';

import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

type Props = {
  formDataKey: FormKeys;
};

const FieldName: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<MaintenanceWork>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<MaintenanceWork, MaintenanceWork['name']>(props.formDataKey, 'name');

    const error = useForm.useFormDataFormErrorsPickValue<MaintenanceWork, string>(props.formDataKey, 'name');
    const handleChange = useForm.useFormDataHandleChange<MaintenanceWork>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<MaintenanceWork>(props.formDataKey);

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
