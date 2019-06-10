import * as React from 'react';

import { FieldDataWaybillWorkModeId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillWorkModeIdString from './FieldWaybillWorkModeIdString';
import FieldWaybillWorkModeIdArray from './FieldWaybillWorkModeIdArray';

type FieldWaybillWorkModeIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillWorkModeId;
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
                <FieldWaybillWorkModeIdArray {...props} />
              )
              : (
                <FieldWaybillWorkModeIdString {...props} />
              )
          }
        </React.Fragment>
      ),
      [IS_DRAFT, props],
    );
  },
);

export default FieldWaybillWorkModeId;
