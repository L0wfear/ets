import * as React from 'react';

import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { FooterEnd } from 'global-styled/global-styled';

type WaybillCarRefillFuelGivenProps = {
  formDataKey: string;
};

const WaybillCarRefillFuelGiven: React.FC<WaybillCarRefillFuelGivenProps> = React.memo(
  (props) => {
    const {
      fuel_given,
      car_refill,
    } = useForm.useFormDataFormState<Waybill>(props.formDataKey);
    const not_empty_car_refill = car_refill.length > 0;

    return not_empty_car_refill && (
      <FooterEnd margin={30}>
        <div><b>{'Итого '}</b></div>
        <div><b>{Number(fuel_given).toFixed(3)}</b></div>
      </FooterEnd>
    );
  },
);

export default WaybillCarRefillFuelGiven;
