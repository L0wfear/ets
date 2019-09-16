import * as React from 'react';
import { get } from 'lodash';

import useForm from 'components/@next/@form/hook_selectors/useForm';

import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';
import { FileField } from 'components/old/ui/input/fields';

type Props = {
  formDataKey: any;
};

const FieldFiles: React.FC<Props> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<InspectOneActScan>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<InspectOneActScan, InspectOneActScan['files']>(props.formDataKey, 'files');
    const IS_CREATING = useForm.useFormDataIsCreating(props.formDataKey);

    const error = useForm.useFormDataFormErrorsPickValue<InspectOneActScan, string>(props.formDataKey, 'files');

    const handleChange = useForm.useFormDataHandleChange<InspectOneActScan>(props.formDataKey);
    const isPermitted = useForm.useFormDataIsPermitted<InspectOneActScan>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ files: value || [] });
      },
      [handleChange],
    );

    return (
      <FileField
        id={`${path}_files`}
        label="Файл"
        value={formStateValue}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted || !IS_CREATING}
      />
    );
  },
);

export default FieldFiles;
