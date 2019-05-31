import * as React from 'react';
import { FieldDataWaybillCarId } from 'components/new/utils/context/form/@types/fields/waybill/valueOfArray';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillCarIdArrayArray from './FieldWaybillCarIdArray';
import FieldWaybillCarIdString from './FieldWaybillCarIdString';

type FieldWaybillCarIdProps = {
  formDataKey: string;
  fieldData: FieldDataWaybillCarId;
};

const FieldWaybillCarId: React.FC<FieldWaybillCarIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          IS_DRAFT
            ? (
                <FieldWaybillCarIdArrayArray
                  formDataKey={props.formDataKey}
                  fieldData={props.fieldData}
                />
            )
            : (
                <FieldWaybillCarIdString
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

export default FieldWaybillCarId;
