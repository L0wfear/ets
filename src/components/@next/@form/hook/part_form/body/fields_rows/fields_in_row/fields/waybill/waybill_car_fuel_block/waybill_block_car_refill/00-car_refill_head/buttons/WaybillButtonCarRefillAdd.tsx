import * as React from 'react';

import { ButtonTableInput } from 'components/new/ui/table_input/styled';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import useForm from 'components/@next/@form/hook_selectors/useForm';

type WaybillButtonCarRefillAddProps = {
  formDataKey: any;
};

const WaybillButtonCarRefillAdd: React.FC<WaybillButtonCarRefillAddProps> = React.memo(
  (props) => {
    const handleChange = useForm.useFormDataHandleChange<Waybill>(props.formDataKey);
    const car_refill = useForm.useFormDataFormStatePickValue<Waybill, Waybill['car_refill']>(props.formDataKey, 'car_refill');

    const handleAddRow = React.useCallback(
      () => {
        const car_refill_new = [...car_refill];
        car_refill_new.push({
          fuel_card_id: null,
          type_id: null,
          value: null,
          number: null,
        });

        handleChange({
          car_refill: car_refill_new,
        });
      },
      [car_refill, handleChange],
    );

    return (
      <ButtonTableInput block width={160} onClick={handleAddRow}>Добавить заправку</ButtonTableInput>
    );
  },
);

export default WaybillButtonCarRefillAdd;
