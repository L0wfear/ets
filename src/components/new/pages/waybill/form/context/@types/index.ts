import { Mission } from "redux-main/reducers/modules/missions/mission/@types";
import { DefaultSelectListMapper } from "components/ui/input/ReactSelect/utils";
import { CompanyStructureLinear } from "redux-main/reducers/modules/company_structure/@types/company_structure.h";
import { Employee } from "redux-main/reducers/modules/employee/@types/employee.h";
import { Car } from "redux-main/reducers/modules/autobase/@types/autobase.h";
import { EmployeeBindedToCar } from "components/new/utils/context/loading/@types/by_service/employee_binded_to_car";
import { MedicalStatsAllowedDriver } from "components/new/utils/context/loading/@types/by_service/medical_stats_allowed_drivers";
import { WorkMode } from "components/new/utils/context/loading/@types/by_service/work_mode";

export type WaybillFormStoreType = {
  mission_reject_list: {
    value: Mission[],
    isLoading: boolean,
  },
  mission_list: {
    value: Mission[],
    isLoading: boolean,
  },
  structure_id: {
    options: DefaultSelectListMapper<CompanyStructureLinear>,
    isLoading: boolean,
  },
  employee: {
    listIndex: Record<Employee['id'], Employee>,
    options: {
      value: Employee['id'];
      label: Employee['full_name'];
      rowData: Employee;
    }[],
    isLoading: boolean,
  },
  carActualList: {
    options: {
      value: Car['asuods_id'];
      label: string;
      rowData: Car;
    }[],
    isLoading: boolean,
  },
  employeeBindedToCar: {
    list: EmployeeBindedToCar[];
    isLoading: boolean,
  },
  medicalStatsAllowedDrivers: {
    list: MedicalStatsAllowedDriver[];
    isLoading: boolean,
  },
  workModeOptions: {
    options: {
      value: WorkMode['id'];
      label: string;
      rowData: WorkMode;
    }[]
    isLoading: boolean;
  };
};
