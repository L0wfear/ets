import * as React from 'react';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillTrailerIdString from './FieldWaybillTrailerIdString';
import FieldWaybillTrailerIdArray from './FieldWaybillTrailerIdArray';

type FieldWaybillTrailerIdProps = {
  formDataKey: any;
  md?: number;
};

const FieldWaybillTrailerId: React.FC<FieldWaybillTrailerIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return (
      IS_DRAFT
        ? (
          <FieldWaybillTrailerIdArray
            formDataKey={props.formDataKey}
            md={props.md}
          />
        )
        : (
          <FieldWaybillTrailerIdString
            formDataKey={props.formDataKey}
            md={props.md}
          />
        )
    );
  },
);

export default FieldWaybillTrailerId;
