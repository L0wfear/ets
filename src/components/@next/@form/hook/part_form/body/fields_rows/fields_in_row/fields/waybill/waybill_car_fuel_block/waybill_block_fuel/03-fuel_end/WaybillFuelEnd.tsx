import * as React from 'react';

import { ExtField } from 'components/old/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type WaybillFuelEndProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFuelEnd: React.FC<WaybillFuelEndProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const fuel_start = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fuel_start']>(props.formDataKey, 'fuel_start');
    const fuel_given = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fuel_given']>(props.formDataKey, 'fuel_given');
    const tax_data = useForm.useFormDataFormStatePickValue<Waybill, Waybill['tax_data']>(props.formDataKey, 'tax_data');
    const equipment_tax_data = useForm.useFormDataFormStatePickValue<Waybill, Waybill['equipment_tax_data']>(props.formDataKey, 'equipment_tax_data');
    const fuel_end = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fuel_end']>(props.formDataKey, 'fuel_end');
    const equipment_fuel = useForm.useFormDataFormStatePickValue<Waybill, Waybill['equipment_fuel']>(props.formDataKey, 'equipment_fuel');
    const is_one_fuel_tank = useForm.useFormDataFormStatePickValue<Waybill, Waybill['is_one_fuel_tank']>(props.formDataKey, 'is_one_fuel_tank');

    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);

    React.useEffect(
      () => {
        let fuel_end_new = null;

        if (equipment_fuel && !is_one_fuel_tank) {
          fuel_end_new = (
            (Number(fuel_start) + Number(fuel_given))
            - tax_data.reduce((summ, { RESULT }) => summ + Number(RESULT), 0)
          );
        } else {
          fuel_end_new = (
            (Number(fuel_start) + Number(fuel_given))
            - tax_data.reduce((summ, { RESULT }) => summ + Number(RESULT), 0)
            - equipment_tax_data.reduce((summ, { RESULT }) => summ + Number(RESULT), 0)
          );
        }
        if (fuel_end !== fuel_end_new) {
          handleChange({
            fuel_end: fuel_end_new,
          });
        }
      },
      [fuel_end, equipment_fuel, is_one_fuel_tank, fuel_start, fuel_given],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_fuel_end`}
          type="number"
          label="Возврат по таксировке, л"
          value={fuel_end}
          disabled
        />
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFuelEnd;
