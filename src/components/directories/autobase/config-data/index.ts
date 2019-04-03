import { getChildrenData } from 'utils/routes/getChildrenData';

import carActualList from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
import carFuncTypesList from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data';
import typesAttrList from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data';
import techInspectionList from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data';
import roadAccidentList from 'components/new/pages/nsi/autobase/pages/road_accident/_config-data';
import insurancePolicyList from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';

import batteryRegistry from 'components/directories/autobase/battery_registry/config-data';
import batteryBrand from 'components/directories/autobase/battery_brand/config-data';
import batteryManufacturer from 'components/directories/autobase/battery_manufacturer/config-data';
import tire from 'components/directories/autobase/tire/config-data';
import tireModel from 'components/directories/autobase/tire_model/config-data';
import sparePart from 'components/directories/autobase/spare_part/config-data';
import techMaintenanceOrderRegistry from 'components/directories/autobase/tech_maintenance_order_registry/config-data';
import repair from 'components/directories/autobase/repair/config-data';
import repairCompany from 'components/directories/autobase/repair_company/config-data';
import fuelCards from 'components/directories/autobase/fuel_cards/config-data';

import carsListOld from 'components/directories/autobase/cars/config-data';

const children = {
  carActualList,
  carsListOld,
  carFuncTypesList,
  typesAttrList,
  batteryRegistry,
  batteryBrand,
  batteryManufacturer,
  tire,
  tireModel,
  sparePart,
  techMaintenanceOrderRegistry,
  techInspectionList,
  insurancePolicyList,
  repair,
  repairCompany,
  roadAccidentList,
  fuelCards,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};
