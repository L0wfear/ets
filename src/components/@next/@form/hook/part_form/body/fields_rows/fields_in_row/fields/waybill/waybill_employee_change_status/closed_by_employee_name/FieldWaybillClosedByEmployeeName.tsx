import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useWaybillFormData from 'components/@next/@form/hook_selectors/waybill/useWaybillForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type FieldWaybillClosedByEmployeeNameProps = {
  formDataKey: string;
};

const FieldWaybillClosedByEmployeeName: React.FC<FieldWaybillClosedByEmployeeNameProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const key = 'closed_by_employee_name';

    const closed_by_employee_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['closed_by_employee_name']>(props.formDataKey, key);
    const IS_CLOSED = useWaybillFormData.useFormDataIsClosed(props.formDataKey);

    return IS_CLOSED && (
      <EtsBootstrap.Col md={12}>
        <ExtField
          id={`${path}_${key}`}
          type="string"
          label="Закрыт"
          value={closed_by_employee_name}
          readOnly
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillClosedByEmployeeName;
