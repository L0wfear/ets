/**
 * @module directories
 * Реестры и справочники
 */
import Autobase from 'components/directories/autobase';
import CleaningRateDirectory from 'components/directories/data_for_calculation/cleaning_rate/CleaningRateDirectory.jsx';
import EfficiencyList from 'components/directories/data_for_calculation/efficiency/EfficiencyList.jsx';
import EmployeesList from 'components/directories/employees/EmployeesList.jsx';
import FuelOperationsDirectory from 'components/directories/data_for_calculation/fuel_operations/FuelOperationsDirectory.jsx';
import FuelRatesDirectory from 'components/directories/normative/fuel_rates/FuelRatesDirectory.jsx';
import Geoobject from 'components/directories/geoobjects/index.js';
import MaintenanceRateDirectory from 'components/directories/normative/maintenance_rate/MaintenanceRateDirectory.jsx';
import MaintenanceWorkDirectory from 'components/directories/data_for_calculation/maintenance_work/MaintenanceWorkDirectory.jsx';
import MaterialConsumptionRateDirectory from 'components/directories/normative/material_consumption_rate/MaterialConsumptionRateDirectory.jsx';
import MedicalStatsList from 'components/directories/medical_stats/MedicalStatsList.jsx';
import ODHNormDataSummerList from 'components/directories/data_for_calculation/odh_norm_data_summer/ODHNormDataSummerList.jsx';
import ODHNormList from 'components/directories/data_for_calculation/odh_norm/ODHNormList.jsx';
import OrderList from 'components/directories/order/OrderList.tsx';
import OrganizationsDirectory from 'components/directories/organizations/OrganizationsDirectory.jsx';
import Repair from 'components/directories/repair/index.js';
import TechnicalOperationsDirectory from 'components/directories/technical_operation/TechnicalOperationsDirectory.jsx';
import UserActionLogList from 'components/directories/user_action_log/UserActionLogList.jsx';

export default {
  Autobase,
  CleaningRateDirectory,
  EfficiencyList,
  EmployeesList,
  FuelOperationsDirectory,
  FuelRatesDirectory,
  Geoobject,
  MaintenanceRateDirectory,
  MaintenanceWorkDirectory,
  MaterialConsumptionRateDirectory,
  MedicalStatsList,
  ODHNormDataSummerList,
  ODHNormList,
  OrderList,
  OrganizationsDirectory,
  Repair,
  TechnicalOperationsDirectory,
  UserActionLogList,
};
