import * as React from 'react';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import FieldWaybillActivatedByEmployeeName from './activated_by_employee_name/FieldWaybillActivatedByEmployeeName';
import FieldWaybillClosedByEmployeeName from './closed_by_employee_name/FieldWaybillClosedByEmployeeName';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillEmployeeChangeStatusProps = {
  formDataKey: any;
};

const FieldWaybillEmployeeChangeStatus: React.FC<FieldWaybillEmployeeChangeStatusProps> = React.memo(
  (props) => {
    const IS_CLOSE_OR_IS_ACTIVE = useWaybillFormData.useFormDataIsActiveOrIsClosed(props.formDataKey);

    return IS_CLOSE_OR_IS_ACTIVE && (
      <EtsBootstrap.Col md={2}>
        <EtsBootstrap.Row>
          <FieldWaybillActivatedByEmployeeName formDataKey={props.formDataKey} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillClosedByEmployeeName formDataKey={props.formDataKey} />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillEmployeeChangeStatus;
