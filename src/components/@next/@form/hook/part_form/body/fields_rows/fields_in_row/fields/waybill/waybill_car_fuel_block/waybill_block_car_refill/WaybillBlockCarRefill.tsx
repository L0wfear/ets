import * as React from 'react';

import EtsBootstrap from 'components/new/ui/@bootstrap';
import WaybillCarRefillHeader from './00-car_refill_head/WaybillCarRefillHeader';
import WaybillCarRefillTableInput from './01-car_refill_table_input/WaybillCarRefillTableInput';
import WaybillCarRefillFuelGiven from './02-car_refill_fuel_given/WaybillCarRefillFuelGiven';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type WaybillBlockCarRefillProps = {
  formDataKey: string;
  md?: number;
};

const WaybillBlockCarRefill: React.FC<WaybillBlockCarRefillProps> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState<number>(null);
    const {
      car_refill,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);

    React.useEffect(
      () => {
        if (selectedRowIndex >= car_refill.length) {
          setSelectedRowIndex(null);
        }
      },
      [car_refill.length, selectedRowIndex, setSelectedRowIndex],
    );

    return React.useMemo(
      () => (
        <EtsBootstrap.Col md={props.md || 12}>
          <WaybillCarRefillHeader formDataKey={props.formDataKey} selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex} />
          <WaybillCarRefillTableInput formDataKey={props.formDataKey} selectedRowIndex={selectedRowIndex} setSelectedRowIndex={setSelectedRowIndex}  />
          <WaybillCarRefillFuelGiven formDataKey={props.formDataKey} />
        </EtsBootstrap.Col>
      ),
      [
        props,
        selectedRowIndex,
        setSelectedRowIndex,
      ],
    );
  },
);

export default WaybillBlockCarRefill;
