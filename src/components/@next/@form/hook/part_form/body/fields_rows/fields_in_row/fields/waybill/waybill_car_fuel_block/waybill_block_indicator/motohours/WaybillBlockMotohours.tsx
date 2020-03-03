import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import WaybillFieldMotohoursStart from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/motohours/00-motohours_start/WaybillFieldMotohoursStart';
import WaybillFieldMotohoursEnd from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/motohours/01-motohours_end/WaybillFieldMotohoursEnd';
import WaybillFieldMotohoursDiff from 'components/@next/@form/hook/part_form/body/fields_rows/fields_in_row/fields/waybill/waybill_car_fuel_block/waybill_block_indicator/motohours/02-motohours_diff/WaybillFieldMotohoursDiff';

type WaybillBlockMotohoursProps = {
  formDataKey: any;
  md?: number;
};

const WaybillBlockMotohours: React.FC<WaybillBlockMotohoursProps> = React.memo(
  (props) => {
    return (
      <EtsBootstrap.Col md={props.md || 12}>
        <h4>Счетчик моточасов</h4>
        <EtsBootstrap.Row>
          <WaybillFieldMotohoursStart formDataKey={props.formDataKey} md={12} />
          <WaybillFieldMotohoursEnd formDataKey={props.formDataKey} md={12} />
          <WaybillFieldMotohoursDiff formDataKey={props.formDataKey} md={12} />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillBlockMotohours;
