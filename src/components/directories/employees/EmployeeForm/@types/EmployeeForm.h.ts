import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import {
  EmployeeUpdateEmployee,
  EmployeeCreateEmployee,
} from 'redux-main/reducers/modules/employee/employee/@types';
import { GetCar } from 'redux-main/reducers/modules/autobase/car/@types';
import { DefaultSelectListMapper } from 'components/ui/input/ReactSelect/utils';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Position } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { GetPosition } from 'redux-main/reducers/modules/employee/position/@types';
import { GetCompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/company_structure/@types';
import { CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { ReduxState } from 'redux-main/@types/state';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsEmployeeFormWrap = {
  showForm: boolean;
  element: Employee | null;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsEmployee = {
  category_license: ReduxState['session']['appConfig']['category_license'];
};
export type DispatchPropsEmployee = {
  createAction: EmployeeCreateEmployee;
  updateAction: EmployeeUpdateEmployee;
  autobaseGetSetCar: GetCar;
  employeePositionGetSetPosition: GetPosition;
  companyStructureActions: GetCompanyStructureLinear;
};
export type OwnEmployeeProps = {
  element: Employee | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsEmployeeWithForm = (
  StatePropsEmployee
  & DispatchPropsEmployee
  & OwnEmployeeProps
);

export type PropsEmployee = OutputWithFormProps<
  PropsEmployeeWithForm,
  Employee,
  [ Employee ],
  any
>;
export type StateEmployee = {
  carOptions: DefaultSelectListMapper<Car['asuods_id'], Car['gov_number'], Car>;
  positionOptions: DefaultSelectListMapper<Position['id'], Position['position'], Position>;
  companyStructureOptions: DefaultSelectListMapper<CompanyStructureLinear['id'], CompanyStructureLinear['name'], CompanyStructureLinear>;
  isCommonOptions: { value: number; label: string }[];
  driverStateOptions: { value: number; label: string }[];
  categoryDriversLicenseOptions: { value: number; label: string }[];
  categorySpecialLicenseOptions: { value: number; label: string }[];
};
