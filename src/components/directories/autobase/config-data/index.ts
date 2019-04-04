import { getChildrenData } from 'utils/routes/getChildrenData';

import carActualList from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
// old
import carsListOld from 'components/directories/autobase/cars/config-data';

import carFuncTypesList from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data';
import typesAttrList from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data';
// old
import batteryRegistry from 'components/directories/autobase/battery_registry/config-data';

import batteryBrandList from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data';
import batteryManufacturerList from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/_config-data';
// old
import tire from 'components/directories/autobase/tire/config-data';

import tireModelList from 'components/new/pages/nsi/autobase/pages/tire_model/_config-data';
import sparePartList from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data';

// old
import techMaintenanceOrderRegistry from 'components/directories/autobase/tech_maintenance_order_registry/config-data';

import techInspectionList from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data';
import insurancePolicyList from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';
// old
import repairCompany from 'components/directories/autobase/repair_company/config-data';
import fuelCards from 'components/directories/autobase/fuel_cards/config-data';

const children = {
  carActualList,
  carsListOld,
  carFuncTypesList,
  typesAttrList,
  batteryRegistry,
  batteryBrandList,
  batteryManufacturerList,
  tire,
  tireModelList,
  sparePartList,
  techMaintenanceOrderRegistry,
  techInspectionList,
  insurancePolicyList,
  repairCompany,
  fuelCards,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};
