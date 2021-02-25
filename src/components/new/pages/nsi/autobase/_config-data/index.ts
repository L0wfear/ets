import { getChildrenData } from 'utils/routes/getChildrenData';

import carActualList from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
import carFuncTypesList from 'components/new/pages/nsi/autobase/pages/car-func-types/_config-data';
import typesAttrList from 'components/new/pages/nsi/autobase/pages/types-attr/_config-data';
import batteryRegistryList from 'components/new/pages/nsi/autobase/pages/battery_registry/_config-data';
import batteryBrandList from 'components/new/pages/nsi/autobase/pages/battery_brand/_config-data';
import batteryManufacturerList from 'components/new/pages/nsi/autobase/pages/battery_manufacturer/_config-data';
import tireList from 'components/new/pages/nsi/autobase/pages/tire/_config-data';
import tireModelList from 'components/new/pages/nsi/autobase/pages/tire_model/_config-data';
import sparePartList from 'components/new/pages/nsi/autobase/pages/spare_part/_config-data';
import techMaintenanceOrderList from 'components/new/pages/nsi/autobase/pages/tech_maintenance_order/_config-data';
import techInspectionList from 'components/new/pages/nsi/autobase/pages/tech_inspection/_config-data';
import insurancePolicyList from 'components/new/pages/nsi/autobase/pages/insurance_policy/_config-data';
import repairCompanyList from 'components/new/pages/nsi/autobase/pages/repair_company/_config-data';
import fuelCardsList from 'components/new/pages/nsi/autobase/pages/fuel_cards/_config-data';
import fuelCardsArchiveList from 'components/new/pages/nsi/autobase/pages/fuel_cards_archive/_config-data';
import penaltiesList from 'components/new/pages/nsi/autobase/pages/penalties/_config-data';
import tachographPeriodicVerificationList from 'components/new/pages/nsi/autobase/pages/tachograph_periodic_verification/_config-data';
import tachographList from 'components/new/pages/nsi/autobase/pages/tachograph/_config-data';
import tachographRepairList from 'components/new/pages/nsi/autobase/pages/tachograph_repair/_config-data';
import tachographMetrologicalVerificationList from 'components/new/pages/nsi/autobase/pages/tachograph_metrological_verification/_config-data';
import refillList from 'components/new/pages/nsi/autobase/pages/refill_registry/_config-data';
import techInspectionArchiveList from 'components/new/pages/nsi/autobase/pages/tech_inspection_archive/_config-data';
import insurancePolicyArchiveList from 'components/new/pages/nsi/autobase/pages/insurance_policy_archive/_config-data';

const children = {
  carActualList,
  carFuncTypesList,
  typesAttrList,
  batteryRegistryList,
  batteryBrandList,
  batteryManufacturerList,
  tireList,
  tireModelList,
  sparePartList,
  techMaintenanceOrderList,
  techInspectionList,
  techInspectionArchiveList,
  insurancePolicyList,
  insurancePolicyArchiveList,
  repairCompanyList,
  fuelCardsList,
  fuelCardsArchiveList,
  penaltiesList,
  tachographList,
  tachographRepairList,
  tachographPeriodicVerificationList,
  tachographMetrologicalVerificationList,
  refillList,
};

export default {
  title: 'Транспортные средства',
  children,
  ...getChildrenData(children),
};
