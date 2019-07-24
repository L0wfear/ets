import * as React from 'react';
import { ExtField } from 'components/ui/new/field/ExtField';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

type FuelTypeProps = {
  modalKey: string;
  error: string;
  disabled: boolean;
  options: any[];
  handleChange: any;

} & (
  {
    keyField: 'fuel_type';
    value: Waybill['fuel_type'];
  } | {
    keyField: 'equipment_fuel_type';
    value: Waybill['equipment_fuel_type'];
  }
);

const FuelType: React.FC<FuelTypeProps> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (value) => {
        props.handleChange({
          [props.keyField]: value,
        });
      },
      [props.handleChange],
    );

    return (
      <ExtField
        id={props.keyField}
        type="select"
        modalKey={props.modalKey}
        label="Тип топлива"
        error={props.error}
        disabled={props.disabled}
        options={props.options}
        value={props.value}
        onChange={handleChange}
      />
    );
  },
);

export default FuelType;
