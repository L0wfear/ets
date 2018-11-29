import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import * as sparePart from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/actions';
import * as sparePartGroup from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/actions';
import * as measureUnit from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/actions';
import * as batteryBrand from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/actions';
import * as batteryManufacturer from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/actions';
import * as batteryRegistry from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/actions';
import * as insuranceType from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_type/actions';
import * as insurancePolicy from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/actions';
import * as car from 'redux-main/reducers/modules/autobase/car/actions';
import * as carFuncTypes from 'redux-main/reducers/modules/autobase/car_func_types/actions';

export default {
  autobaseSetNewData,
  ...sparePart,
  ...sparePartGroup,
  ...measureUnit,
  ...batteryBrand,
  ...batteryManufacturer,
  ...batteryRegistry,
  ...insuranceType,
  ...insurancePolicy,
  ...car,
  ...carFuncTypes,
};
