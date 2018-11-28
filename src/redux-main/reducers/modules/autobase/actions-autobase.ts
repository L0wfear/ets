import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import * as sparePart from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/actions';
import * as sparePartGroup from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/actions';
import * as measureUnit from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/actions';
import * as batteryBrand from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/actions';
import * as batteryManufacturer from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/actions';
import * as batteryRegistry from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/actions';

export default {
  autobaseSetNewData,
  ...sparePart,
  ...sparePartGroup,
  ...measureUnit,
  ...batteryBrand,
  ...batteryManufacturer,
  ...batteryRegistry,
};
