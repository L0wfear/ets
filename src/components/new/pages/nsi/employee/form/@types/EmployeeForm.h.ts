import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DefaultSelectListMapper, DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Position } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { ReduxState } from 'redux-main/@types/state';
import { WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsEmployee = {
  category_license: ReduxState['session']['appConfig']['category_license'];
};
export type OwnEmployeeProps = (
  WithFormRegistrySearchProps<Employee>
  & WithFormRegistrySearchAddProps<Employee>
  & {}
);

export type PropsEmployeeWithForm = (
  StatePropsEmployee
  & OwnEmployeeProps
);

export type PropsEmployee = OutputWithFormProps<
  PropsEmployeeWithForm,
  Employee,
  [ Employee ],
  any
>;
export type StateEmployee = {
  carList: Array<Car>;
  preferCarOptions: Array<DefaultSelectOption<Car['asuods_id'], string, Car>>;
  secondaryCarOptions: Array<DefaultSelectOption<Car['asuods_id'], string, Car>>;
  positionOptions: DefaultSelectListMapper<Position>;
  companyStructureOptions: DefaultSelectListMapper<CompanyStructureLinear>;
  isCommonOptions: Array<{ value: number; label: string; }>;
  countryOptions: Array<{ value: number; label: string; }>;
  driverStateOptions: Array<{ value: number; label: string; }>;
  categoryDriversLicenseOptions: Array<{ value: number; label: string; }>;
  categorySpecialLicenseOptions: Array<{ value: number; label: string; }>;
};
