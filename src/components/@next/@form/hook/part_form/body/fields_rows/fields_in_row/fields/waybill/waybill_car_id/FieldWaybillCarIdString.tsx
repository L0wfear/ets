import * as React from 'react';
import { ExtField } from 'components/old/ui/new/field/ExtField';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { carActualOptionLabel } from './useWaybillCarActualOptions';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FieldWaybillCarIdStringProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillCarIdString: React.FC<FieldWaybillCarIdStringProps> = React.memo(
  (props) => {

    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const gov_number = useForm.useFormDataFormStatePickValue<Waybill, Waybill['gov_number']>(props.formDataKey, 'gov_number');
    const car_model_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_model_name']>(props.formDataKey, 'car_model_name');
    const car_special_model_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_special_model_name']>(props.formDataKey, 'car_special_model_name');
    const car_type_name = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_type_name']>(props.formDataKey, 'car_type_name');

    const value = React.useMemo(
      () => {
        return carActualOptionLabel(
          gov_number,
          car_model_name,
          car_special_model_name,
          car_type_name,
        );
      },
      [
        gov_number,
        car_model_name,
        car_special_model_name,
        car_type_name,
      ],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_car_id`}
          type="string"
          label="Транспортное средство"
          readOnly
          value={value}
        />
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillCarIdString;
