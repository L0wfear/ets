import * as React from 'react';
import { Col } from 'react-bootstrap';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';

type FieldWaybillEmployeeChangeStatusProps = {
  fieldData: FieldDataName;
  formDataKey: string;
};

const FieldWaybillEmployeeChangeStatus: React.FC<FieldWaybillEmployeeChangeStatusProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    return React.useMemo(
      () => {
        return (
          IS_CLOSE_OR_IS_ACTIVE
            && (
              <Col md={2}>
                FieldWaybillEmployeeChangeStatus
              </Col>
            )
        );
      },
      [IS_CLOSE_OR_IS_ACTIVE],
    );
  },
);

export default FieldWaybillEmployeeChangeStatus;
