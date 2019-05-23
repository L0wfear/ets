import { Mission } from "redux-main/reducers/modules/missions/mission/@types";
import { DefaultSelectListMapper } from "components/ui/input/ReactSelect/utils";
import { CompanyStructureLinear } from "redux-main/reducers/modules/company_structure/@types/company_structure.h";
import { Employee } from "redux-main/reducers/modules/employee/@types/employee.h";
import { Car } from "redux-main/reducers/modules/autobase/@types/autobase.h";

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
};
