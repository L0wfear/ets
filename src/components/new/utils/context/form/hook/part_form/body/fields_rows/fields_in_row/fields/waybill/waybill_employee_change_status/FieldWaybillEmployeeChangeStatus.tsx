import * as React from 'react';
import { FieldDataName } from 'components/new/utils/context/form/@types/fields/string';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';
import FieldWaybillActivatedByEmployeeName from './activated_by_employee_name/FieldWaybillActivatedByEmployeeName';
import FieldWaybillClosedByEmployeeName from './closed_by_employee_name/FieldWaybillClosedByEmployeeName';
import EtsBootstrap from 'components/new/ui/@bootstrap';

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
              <EtsBootstrap.Col md={2}>
                <EtsBootstrap.Row>
                  <FieldWaybillActivatedByEmployeeName formDataKey={props.formDataKey} />
                </EtsBootstrap.Row>
                <EtsBootstrap.Row>
                  <FieldWaybillClosedByEmployeeName formDataKey={props.formDataKey} />
                </EtsBootstrap.Row>
              </EtsBootstrap.Col>
            )
        );
      },
      [props, IS_CLOSE_OR_IS_ACTIVE],
    );
  },
);

export default FieldWaybillEmployeeChangeStatus;
