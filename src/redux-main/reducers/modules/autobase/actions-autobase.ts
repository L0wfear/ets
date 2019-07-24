import { autobaseSetNewData } from 'redux-main/reducers/modules/autobase/actions_by_type/common';
import * as sparePart from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part/actions';
import * as sparePartGroup from 'redux-main/reducers/modules/autobase/actions_by_type/spare_part_group/actions';
import * as measureUnit from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit/actions';
import * as batteryBrand from 'redux-main/reducers/modules/autobase/actions_by_type/battery_brand/actions';
import * as batteryManufacturer from 'redux-main/reducers/modules/autobase/actions_by_type/battery_manufacturer/actions';
import * as batteryRegistry from 'redux-main/reducers/modules/autobase/actions_by_type/battery_registry/actions';
import * as batteryAvailableCar from 'redux-main/reducers/modules/autobase/actions_by_type/battery_available_car/actions';
import * as insuranceType from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_type/actions';
import * as insurancePolicy from 'redux-main/reducers/modules/autobase/actions_by_type/insurance_policy/actions';
import * as car from 'redux-main/reducers/modules/autobase/car/actions';
import * as carFuncTypes from 'redux-main/reducers/modules/autobase/car_func_types/actions';
import * as repair from 'redux-main/reducers/modules/autobase/actions_by_type/repair/actions';
import * as repairCompany from 'redux-main/reducers/modules/autobase/actions_by_type/repair_company/actions';
import * as repairType from 'redux-main/reducers/modules/autobase/actions_by_type/repair_type/actions';
import * as roadAccident from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident/actions';
import * as roadAccidentCause from 'redux-main/reducers/modules/autobase/actions_by_type/road_accident_cause/actions';
import * as techInspection from 'redux-main/reducers/modules/autobase/actions_by_type/tech_inspection/actions';
import * as techMaintOrder from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_order/actions';
import * as techMaintType from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint_type/actions';
import * as measureUnitRun from 'redux-main/reducers/modules/autobase/actions_by_type/measure_unit_run/actions';
import * as tireModel from 'redux-main/reducers/modules/autobase/actions_by_type/tire_model/actions';
import * as tireManufacturer from 'redux-main/reducers/modules/autobase/actions_by_type/tire_manufacturer/actions';
import * as tire from 'redux-main/reducers/modules/autobase/actions_by_type/tire/actions';
import * as tireAvailableCar from 'redux-main/reducers/modules/autobase/actions_by_type/tire_available_car/actions';
import * as spareAvailableCar from 'redux-main/reducers/modules/autobase/actions_by_type/spare_available_car/actions';
import * as tireSize from 'redux-main/reducers/modules/autobase/actions_by_type/tire_size/actions';
import * as TechMaintenance from 'redux-main/reducers/modules/autobase/actions_by_type/tech_maint/actions';
import * as carCategory from 'redux-main/reducers/modules/autobase/actions_by_type/car_category/actions';
import * as engineType from 'redux-main/reducers/modules/autobase/actions_by_type/engine_type/actions';
import * as propulsionType from 'redux-main/reducers/modules/autobase/actions_by_type/propulsion_type/actions';
import * as fuelCards from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import * as typesAttr from 'redux-main/reducers/modules/autobase/types_attr/actions';

const autobaseActions = {
  autobaseSetNewData,
  ...sparePart,
  ...sparePartGroup,
  ...measureUnit,
  ...batteryBrand,
  ...batteryManufacturer,
  ...batteryRegistry,
  ...batteryAvailableCar,
  ...insuranceType,
  ...insurancePolicy,
  ...car,
  ...carFuncTypes,
  ...repair,
  ...repairCompany,
  ...repairType,
  ...roadAccident,
  ...roadAccidentCause,
  ...techInspection,
  ...techMaintOrder,
  ...techMaintType,
  ...measureUnitRun,
  ...tireModel,
  ...tireManufacturer,
  ...tire,
  ...tireAvailableCar,
  ...spareAvailableCar,
  ...tireSize,
  ...TechMaintenance,
  ...carCategory,
  ...engineType,
  ...propulsionType,
  ...fuelCards,
  ...typesAttr,
};

export default autobaseActions;
