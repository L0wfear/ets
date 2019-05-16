import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import useForm from 'components/new/utils/context/form/hoc_selectors/useForm';
import { Col } from 'react-bootstrap';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillActivatedByEmployeeNameProps = {
  formDataKey: string;
};

const FieldWaybillActivatedByEmployeeName: React.FC<FieldWaybillActivatedByEmployeeNameProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const key = 'activated_by_employee_name';
    const activated_by_employee_name = useForm.useFormDataFormStatePickValue<Waybill>(props.formDataKey, key);

    return React.useMemo(
      () => (
        <Col md={12}>
          <ExtField
            id={`${path}_${key}`}
            type="string"
            label="Выдан"
            value={activated_by_employee_name}
            readOnly
          />
        </Col>
      ),
      [path, key, activated_by_employee_name],
    );
  },
);

export default FieldWaybillActivatedByEmployeeName;
