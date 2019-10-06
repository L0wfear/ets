import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type FieldOnLineStringProps = {
  formDataKey: any;
  fieldData: (
    any
  );
};

const FieldOnLineString: React.FC<FieldOnLineStringProps> = React.memo(
  (props) => {
    const { fieldData: { key, title } } = props;
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    const value = useForm.useFormDataFormStatePickValue<any, any>(props.formDataKey, key);

    const {
      [key]: error,
    } = useForm.useFormDataFormErrors<any>(props.formDataKey);

    const canEditIfClose = useWaybillFormData.useFormDataCanEditIfClose(props.formDataKey);
    // canEditIfClose

    const isPermitted = useForm.useFormDataIsPermitted<Waybill>(props.formDataKey);
    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const valueNew = get(event, 'target.value', event);
        handleChange({ [key]: valueNew || null });
      },
      [key, handleChange],
    );

    return (
      <EtsBootstrap.Col md={6}>
        <ExtField
          id={key}
          type="string"
          label={title}
          disabled={IS_CLOSED && !canEditIfClose || !isPermitted}
          value={value}
          onChange={handleChangeWrap}
          error={error}
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldOnLineString;
