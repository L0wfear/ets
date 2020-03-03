import * as React from 'react';
import FieldWaybillEmployeeChangeStatus from './waybill_employee_change_status/FieldWaybillEmployeeChangeStatus';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import FieldWaybillStructureAndAccompanyingPerson from './waybill_structure_and_accompanying_person/FieldWaybillStructureAndAccompanyingPerson';
import FieldWaybillDates from './waybill_dates/FieldWaybillDates';
import FieldWaybillCarId from './waybill_car_id/FieldWaybillCarId';
import FieldWaybillTrailerId from './waybill_trailer_id/FieldWaybillTrailerId';
import FieldIsBnsoBroken from '../is_bnso_broken/FieldIsBnsoBroken';
import FieldWaybillDriverId from './waybill_driver_id/FieldWaybillDriverId';
import FieldWaybillWorkModeId from './waybill_work_mode_id/FieldWaybillWorkModeId';
import FieldWaybillIdleTimeOnLine from './waybill_idle_time_on_line/FieldWaybillIdleTimeOnLine';
import FieldWaybillMissions from './waybill_missions/FieldWaybillMissions';
import FieldWaybillEquipmentFuel from './waybill_equipment_fuel/FieldWaybillEquipmentFuel';
import FieldWaybillIsOneFuelTank from './waybill_is_one_fuel_tank/FieldWaybillIsOneFuelTank';
import FieldWaybillCommonFuelStart from './waybill_common_fuel_start/FieldWaybillCommonFuelStart';
import WaybillCarFuelBlock from './waybill_car_fuel_block/WaybillCarFuelBlock';

type WaybillFormBodyProps = {
  formDataKey: any;
};

const WaybillFormBody: React.FC<WaybillFormBodyProps> = React.memo(
  (props) => {
    const { formDataKey } = props;

    return (
      <EtsBootstrap.Col md={12}>
        <EtsBootstrap.Row>
          <FieldWaybillEmployeeChangeStatus formDataKey={formDataKey} />
          <FieldWaybillStructureAndAccompanyingPerson formDataKey={formDataKey} />
          <FieldWaybillDates formDataKey={formDataKey} md={6}/>
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillCarId formDataKey={formDataKey} md={6} />
          <FieldWaybillTrailerId formDataKey={formDataKey} md={6} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldIsBnsoBroken formDataKey={formDataKey} md={12} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillDriverId formDataKey={formDataKey} md={6} />
          <FieldWaybillWorkModeId formDataKey={formDataKey} md={6} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillEquipmentFuel formDataKey={formDataKey} md={4} />
          <FieldWaybillIsOneFuelTank formDataKey={formDataKey} md={4} />
          <FieldWaybillCommonFuelStart formDataKey={formDataKey} md={4} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <WaybillCarFuelBlock formDataKey={formDataKey} md={12} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillMissions formDataKey={formDataKey} />
        </EtsBootstrap.Row>
        <EtsBootstrap.Row>
          <FieldWaybillIdleTimeOnLine formDataKey={formDataKey} md={8} />
        </EtsBootstrap.Row>
      </EtsBootstrap.Col>
    );
  },
);

export default WaybillFormBody;
