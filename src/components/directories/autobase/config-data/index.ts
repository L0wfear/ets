import { getChildrenData } from 'utils/routes/getChildrenData';

import carActualList from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
// old
import carsListOld from 'components/directories/autobase/cars/config-data';

import carFuncTypesList from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data';
import typesAttrList from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data';
import batteryRegistryList from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data';
import batteryBrandList from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data';
import batteryManufacturerList from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/_config-data';
// old
import tire from 'components/directories/autobase/tire/config-data';

import tireModelList from 'components/new/pages/nsi/autobase/pages/tire_model/_config-data';
import sparePartList from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data';
import techMaintenanceOrderList from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/_config-data';
import techInspectionList from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data';
import insurancePolicyList from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';
import repairCompanyList from 'components/new/pages/nsi/autobase/pages/repair_company/_config-data';
import fuelCardsList from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data';

const children = {
  carActualList,
  carsListOld,
  carFuncTypesList,
  typesAttrList,
  batteryRegistryList,
  batteryBrandList,
  batteryManufacturerList,
  tire,
  tireModelList,
  sparePartList,
  techMaintenanceOrderList,
  techInspectionList,
  insurancePolicyList,
  repairCompanyList,
  fuelCardsList,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};
