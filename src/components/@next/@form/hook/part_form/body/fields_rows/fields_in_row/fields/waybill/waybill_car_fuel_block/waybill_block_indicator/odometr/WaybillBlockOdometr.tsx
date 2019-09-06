import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import WaybillFieldOdometrStart from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/odometr/00-odometr_start/WaybillFieldOdometrStart';
import WaybillFieldOdometrEnd from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/odometr/01-odometr_end/WaybillFieldOdometrEnd';
import WaybillFieldOdometrDiff from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/odometr/02-odometr_diff/WaybillFieldOdometrDiff';

type WaybillBlockOdometrProps = {
  formDataKey: string;
  md?: number;
};

const WaybillBlockOdometr: React.FC<WaybillBlockOdometrProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <h4>Одометр</h4>
        <EtsBootstrap.Row>
          <WaybillFieldOdometrStart formDataKey={props.formDataKey} md={12} />
          <WaybillFieldOdometrEnd formDataKey={props.formDataKey} md={12} />
          <WaybillFieldOdometrDiff formDataKey={props.formDataKey} md={12} />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillBlockOdometr;
