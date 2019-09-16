import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';

import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';

type Props = {
  formDataKey: any;
};

const FieldNotes: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<InspectOneActScan>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<InspectOneActScan, InspectOneActScan['notes']>(props.formDataKey, 'notes');

    const formErrors = useForm.useFormDataFormErrors<InspectOneActScan>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<InspectOneActScan>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<InspectOneActScan>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ notes: value || null });
      },
      [handleChange],
    );

    return (
      <ExtField
        id={`${path}_notes`}
        type="string"
        label="Примечание"
        value={formStateValue}
        error={formErrors.notes}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldNotes;
