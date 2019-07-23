import * as React from 'react';

import { ExtField } from 'components/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/new/utils/context/form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';

type WaybillFuelEndProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFuelEnd: React.FC<WaybillFuelEndProps> = React.memo(
  (props) => {
    const path = useForm.useFormDataSchemaPath<any>(props.formDataKey);
    const {
      fuel_start,
      fuel_given,
      tax_data,
      equipment_tax_data,
      fuel_end,
      equipment_fuel,
      is_one_fuel_tank,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
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

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          <ExtField
            id={`${path}_fuel_end`}
            type="number"
            label="Возврат по таксировке, л"
            value={fuel_end}
            disabled
          />
        </EtsBootstrap.Col>
      ),
      [
        props,
        path,
        fuel_end,
      ],
    );
  },
);

export default WaybillFuelEnd;
