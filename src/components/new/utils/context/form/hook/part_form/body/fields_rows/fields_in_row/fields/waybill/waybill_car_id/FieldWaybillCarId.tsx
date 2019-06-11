import * as React from 'react';
import useWaybillFormData from 'components/new/utils/context/form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillCarIdArrayArray from './FieldWaybillCarIdArray';
import FieldWaybillCarIdString from './FieldWaybillCarIdString';

type FieldWaybillCarIdProps = {
  formDataKey: string;
  md?: number;
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
                  md={props.md}
                />
            )
            : (
                <FieldWaybillCarIdString
                  formDataKey={props.formDataKey}
                  md={props.md}
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
