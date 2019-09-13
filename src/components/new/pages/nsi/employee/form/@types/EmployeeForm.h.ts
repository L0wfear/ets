import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { DefaultSelectListMapper, DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { Position } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { CompanyStructureLinear } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';
import { ReduxState } from 'redux-main/@types/state';
import { WithFormRegistrySearchProps, WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

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
  carList: Car[];
  carOptions: DefaultSelectOption<Car['asuods_id'], string, Car>[];
  positionOptions: DefaultSelectListMapper<Position>;
  companyStructureOptions: DefaultSelectListMapper<CompanyStructureLinear>;
  isCommonOptions: { value: number; label: string }[];
  driverStateOptions: { value: number; label: string }[];
  categoryDriversLicenseOptions: { value: number; label: string }[];
  categorySpecialLicenseOptions: { value: number; label: string }[];
};
