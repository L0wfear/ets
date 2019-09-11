import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import ExtField from 'components/@next/@ui/renderFields/Field';

type FieldWaybillCommonFuelStartProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillCommonFuelStart: React.FC<FieldWaybillCommonFuelStartProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);

    const car_id = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_id']>(props.formDataKey, 'car_id');
    const equipment_fuel = useForm.useFormDataFormStatePickValue<Waybill, Waybill['equipment_fuel']>(props.formDataKey, 'equipment_fuel');
    const is_one_fuel_tank = useForm.useFormDataFormStatePickValue<Waybill, Waybill['is_one_fuel_tank']>(props.formDataKey, 'is_one_fuel_tank');
    const equipment_fuel_start = useForm.useFormDataFormStatePickValue<Waybill, Waybill['equipment_fuel_start']>(props.formDataKey, 'equipment_fuel_start');
    const fuel_start = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fuel_start']>(props.formDataKey, 'fuel_start');

    const isShowField = Boolean(car_id && equipment_fuel === true && is_one_fuel_tank === false);

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        {
          isShowField && (
            <ExtField
              id={`${path}_common_fuel_start`}
              type="string"
              label="Общее топливо при выезде, л"
              value={(equipment_fuel_start + fuel_start).toFixed(3)}
              disabled
            />
          )
        }
      </EtsBootstrap.Col>
    );
  },
);

export default FieldWaybillCommonFuelStart;
