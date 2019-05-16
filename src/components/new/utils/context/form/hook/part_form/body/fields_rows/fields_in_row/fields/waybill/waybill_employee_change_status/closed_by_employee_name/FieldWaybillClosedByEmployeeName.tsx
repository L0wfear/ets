import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Col } from 'react-bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/new/utils/context/form/hoc_selectors/waybill/useWaybillForm';

type FieldWaybillClosedByEmployeeNameProps = {
  formDataKey: string;
};

const FieldWaybillClosedByEmployeeName: React.FC<FieldWaybillClosedByEmployeeNameProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const key = 'closed_by_employee_name';
    const closed_by_employee_name = useForm.useFormDataFormStatePickValue<Waybill>(props.formDataKey, key);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    return React.useMemo(
      () => IS_CLOSED && (
        <Col md={12}>
          <ExtField
            id={`${path}_${key}`}
            type="string"
            label="Закрыт"
            value={closed_by_employee_name}
            readOnly
          />
        </Col>
      ),
      [path, key, closed_by_employee_name, IS_CLOSED],
    );
  },
);

export default FieldWaybillClosedByEmployeeName;
