import * as React from 'react';

import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillWorkModeIdString from './FieldWaybillWorkModeIdString';
import FieldWaybillWorkModeIdArray from './FieldWaybillWorkModeIdArray';

type FieldWaybillWorkModeIdProps = {
  formDataKey: any;
  md?: number;
};

const FieldWaybillWorkModeId: React.FC<FieldWaybillWorkModeIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return (
      <React.Fragment>
        {
          IS_DRAFT
            ? (
              <FieldWaybillWorkModeIdArray formDataKey={props.formDataKey} md={props.md} />
            )
            : (
              <FieldWaybillWorkModeIdString formDataKey={props.formDataKey} md={props.md} />
            )
        }
      </React.Fragment>
    );
  },
);

export default FieldWaybillWorkModeId;
