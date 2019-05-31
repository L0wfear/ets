import * as React from 'react';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillTrailerIdString from './FieldWaybillTrailerIdString';
import FieldWaybillTrailerIdArray from './FieldWaybillTrailerIdArray';

type FieldWaybillTrailerIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillTrailerId: React.FC<FieldWaybillTrailerIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          IS_DRAFT
            ? (
              <FieldWaybillTrailerIdArray
                  formDataKey={props.formDataKey}
                  fieldData={props.fieldData}
                />
            )
            : (
                <FieldWaybillTrailerIdString
                  formDataKey={props.formDataKey}
                  fieldData={props.fieldData}
                />
            )
        );
      },
      [
        props,
        IS_DRAFT,
      ],
    );
  },
);

export default FieldWaybillTrailerId;
