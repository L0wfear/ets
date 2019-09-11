import * as React from 'react';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import usePrevious from 'components/new/utils/hooks/usePrevious';

type WaybillFuelGivenProps = {
  formDataKey: string;
  md?: number;
};

const WaybillFuelGiven: React.FC<WaybillFuelGivenProps> = React.memo(
  (props) => {
    const { path } = useForm.useFormDataMeta<any>(props.formDataKey);
    const fuel_given = useForm.useFormDataFormStatePickValue<Waybill, Waybill['fuel_given']>(props.formDataKey, 'fuel_given');
    const car_refill = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_refill']>(props.formDataKey, 'car_refill');

    const handleChange = useForm.useFormDataHandleChange<any>(props.formDataKey);

    const previousCarRefill = usePrevious(car_refill);
    React.useEffect(
      () => {
        if (previousCarRefill !== car_refill) {
          handleChange({
            fuel_given: car_refill.reduce((summ, { value }) => summ + value, 0),
          });
        }
      },
      [previousCarRefill, car_refill, handleChange],
    );

    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <ExtField
          id={`${path}_fuel_given`}
          type="number"
          label="Выдано, л"
          value={fuel_given}
          disabled
        />
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFuelGiven;
