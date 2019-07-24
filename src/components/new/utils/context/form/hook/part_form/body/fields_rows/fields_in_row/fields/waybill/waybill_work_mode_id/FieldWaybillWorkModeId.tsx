import * as React from 'react';

import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillWorkModeIdString from './FieldWaybillWorkModeIdString';
import FieldWaybillWorkModeIdArray from './FieldWaybillWorkModeIdArray';

type FieldWaybillWorkModeIdProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillWorkModeId: React.FC<FieldWaybillWorkModeIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return React.useMemo(
      () => (
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
      ),
      [IS_DRAFT, props],
    );
  },
);

export default FieldWaybillWorkModeId;
