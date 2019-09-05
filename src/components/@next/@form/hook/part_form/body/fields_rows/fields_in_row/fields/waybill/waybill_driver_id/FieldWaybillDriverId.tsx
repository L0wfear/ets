import * as React from 'react';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillDriverIdString from './string/FieldWaybillDriverIdString';
import FieldWaybillDriverIdArray from './array/FieldWaybillDriverIdArray';

type FieldWaybillDriverIdProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillDriverId: React.FC<FieldWaybillDriverIdProps> = React.memo(
  (props) => {
    const IS_DRAFT = useWaybillFormData.useFormDataIsDraft(props.formDataKey);

    return React.useMemo(
      () => (
        <React.Fragment>
          {
            IS_DRAFT
              ? (
                <FieldWaybillDriverIdArray formDataKey={props.formDataKey} md={props.md} />
              )
              : (
                <FieldWaybillDriverIdString formDataKey={props.formDataKey} md={props.md} />
              )
          }
        </React.Fragment>
      ),
      [props, IS_DRAFT],
    );
  },
);

export default FieldWaybillDriverId;
