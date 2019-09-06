import * as React from 'react';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ExtField } from 'components/old/ui/new/field/ExtField';

type FieldWaybillCommonFuelStartProps = {
  formDataKey: string;
  md?: number;
};

const FieldWaybillCommonFuelStart: React.FC<FieldWaybillCommonFuelStartProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const {
      car_id,
      equipment_fuel,
      is_one_fuel_tank,
      equipment_fuel_start,
      fuel_start,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

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
