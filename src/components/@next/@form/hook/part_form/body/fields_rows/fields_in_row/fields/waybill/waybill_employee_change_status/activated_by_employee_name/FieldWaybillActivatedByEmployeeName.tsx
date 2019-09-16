import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillActivatedByEmployeeNameProps = {
  formDataKey: any;
};

const FieldWaybillActivatedByEmployeeName: React.FC<FieldWaybillActivatedByEmployeeNameProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const key = 'activated_by_employee_name';
    const activated_by_employee_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['activated_by_employee_name']>(props.formDataKey, key);

    return (
      <EtsBootstrap.Col md={12}>
        <ExtField
          id={`${path}_${key}`}
          type="string"
          label="Выдан"
          value={activated_by_employee_name}
          readOnly
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillActivatedByEmployeeName;
