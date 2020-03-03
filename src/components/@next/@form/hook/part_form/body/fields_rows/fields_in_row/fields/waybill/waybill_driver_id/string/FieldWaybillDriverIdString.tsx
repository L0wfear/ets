import * as React from 'react';
import ExtField from 'components/@next/@ui/renderFields/Field';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillDriverIdStringProps = {
  formDataKey: any;
  md?: number;
};

const FieldWaybillDriverIdString: React.FC<FieldWaybillDriverIdStringProps> = React.memo(
  (props) => {
    const driver_fio = useForm.useFormDataFormStatePickValue<Waybill, Waybill['driver_fio']>(props.formDataKey, 'driver_fio');

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id="driver-fio"
          type="string"
          label="Водитель"
          readOnly
          value={driver_fio}
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillDriverIdString;
