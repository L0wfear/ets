import * as React from 'react';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillCarIdArrayArray from './FieldWaybillCarIdArray';
import FieldWaybillCarIdString from './FieldWaybillCarIdString';

type FieldWaybillCarIdProps = {
  formDataKey: any;
  md?: number;
};

const FieldWaybillCarId: React.FC<FieldWaybillCarIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return IS_DRAFT
      ? (
        <FieldWaybillCarIdArrayArray
          formDataKey={props.formDataKey}
          md={props.md}
        />
      )
      : (
        <FieldWaybillCarIdString
          formDataKey={props.formDataKey}
          md={props.md}
        />
      );
  },
);

export default FieldWaybillCarId;
