import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { DefaultSelectListMapper } from 'components/old/ui/input/ReactSelect/utils';
import { CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { EmployeeBindedToCar } from 'components/new/utils/context/loading/@types/by_service/employee_binded_to_car';
import { MedicalStatsAllowedDriver } from 'components/new/utils/context/loading/@types/by_service/medical_stats_allowed_drivers';
import { WorkMode } from 'redux-main/reducers/modules/some_uniq/work_mode/@types';
import { RefillType } from 'components/new/utils/context/loading/@types/by_service/refill_type';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

export type WaybillFormStoreType = {
  mission_reject_list: {
    value: Array<Mission>;
    isLoading: boolean;
  };
  mission_list: {
    value: Array<Mission>;
    isLoading: boolean;
  };
  structure_id: {
    options: DefaultSelectListMapper<CompanyStructureLinear>;
    isLoading: boolean;
  };
  employee: {
    listIndex: Record<Employee['id'], Employee>;
    options: Array<{
      value: Employee['id'];
      label: Employee['full_name'];
      rowData: Employee;
    }>;
    isLoading: boolean;
  };
  carActualList: {
    options: Array<{
      value: Car['asuods_id'];
      label: string;
      rowData: Car;
    }>;
    isLoading: boolean;
  };
  employeeBindedToCar: {
    list: Array<EmployeeBindedToCar>;
    isLoading: boolean;
  };
  medicalStatsAllowedDrivers: {
    list: Array<MedicalStatsAllowedDriver>;
    isLoading: boolean;
  };
  workModeOptions: {
    options: Array<{
      value: WorkMode['id'];
      label: string;
      rowData: WorkMode;
    }>;
    isLoading: boolean;
  };
  refillTypeList: {
    list: Array<RefillType>;
    isLoading: boolean;
  };
  refillTypeOptions: {
    options: Array<{
      value: RefillType['id'];
      label: RefillType['name'];
      isNotVisible: boolean;
      rowData: RefillType;
    }>;
    isLoading: boolean;
  };
  fuelCardsList: {
    list: Array<FuelCard>;
    isLoading: boolean;
  };
  carRefillFuelCardsOptions: {
    listIndex: Record<FuelCard['id'], FuelCard>;
    options: Array<{
      value: FuelCard['id'];
      label: FuelCard['number'];
      rowData: FuelCard;
    }>;
    isLoading: boolean;
  };
};
