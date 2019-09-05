import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillDriverIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillDriverIdString: React.FC<FieldWaybillDriverIdStringProps> = React.memo(
  (props) => {
    const {
      driver_fio,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    return React.useMemo(
      () => {
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
      [
        props,
        driver_fio,
      ],
    );
  },
);

export default FieldWaybillDriverIdString;
