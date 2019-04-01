import { getChildrenData } from 'utils/routes/getChildrenData';

import carFuncTypes from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data';
import typesAttr from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data';

import batteryRegistry from 'components/directories/autobase/battery_registry/config-data';
import batteryBrand from 'components/directories/autobase/battery_brand/config-data';
import batteryManufacturer from 'components/directories/autobase/battery_manufacturer/config-data';
import tire from 'components/directories/autobase/tire/config-data';
import tireModel from 'components/directories/autobase/tire_model/config-data';
import sparePart from 'components/directories/autobase/spare_part/config-data';
import techMaintenanceOrderRegistry from 'components/directories/autobase/tech_maintenance_order_registry/config-data';
import techInspection from 'components/directories/autobase/tech_inspection/config-data';
import insurancePolicy from 'components/directories/autobase/insurance_policy/config-data';
import repair from 'components/directories/autobase/repair/config-data';
import repairCompany from 'components/directories/autobase/repair_company/config-data';
import roadAccident from 'components/directories/autobase/road_accident/config-data';
import fuelCards from 'components/directories/autobase/fuel_cards/config-data';

import carsList from 'components/directories/autobase/cars/config-data';

const children = {
  carsList,
  carFuncTypes,
  typesAttr,
  batteryRegistry,
  batteryBrand,
  batteryManufacturer,
  tire,
  tireModel,
  sparePart,
  techMaintenanceOrderRegistry,
  techInspection,
  insurancePolicy,
  repair,
  repairCompany,
  roadAccident,
  fuelCards,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};
