import * as React from 'react';
import { Col, Row } from 'react-bootstrap';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import FieldWaybillActivatedByEmployeeName from './activated_by_employee_name/FieldWaybillActivatedByEmployeeName';
import FieldWaybillClosedByEmployeeName from './closed_by_employee_name/FieldWaybillClosedByEmployeeName';

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
                <Row>
                  <FieldWaybillActivatedByEmployeeName formDataKey={props.formDataKey} />
                </Row>
                <Row>
                  <FieldWaybillClosedByEmployeeName formDataKey={props.formDataKey} />
                </Row>
              </Col>
            )
        );
      },
      [IS_CLOSE_OR_IS_ACTIVE],
    );
  },
);

export default FieldWaybillEmployeeChangeStatus;
