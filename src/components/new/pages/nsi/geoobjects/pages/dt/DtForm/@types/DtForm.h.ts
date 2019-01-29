import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Dt, CreateDt, UpdateDt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { IStateCompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsDtFormWrap = {
  showForm: boolean;
  element: Dt | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
};

export type StatePropsDtForm = {
  companyStructureDescendantsByUserList: IStateCompanyStructure['companyStructureDescendantsByUserList'];
};
export type DispatchPropsDtForm = {
  createAction: CreateDt;
  updateAction: UpdateDt;
  getAndSetInStoreCompanyStructureDescendantsByUser: any;
};
export type OwnPropsDtForm = {
  element: Dt | null;
  handleHide: OnFormHideType
  page?: string;
  path?: string;
};

export type PropsDtFormWithForm = (
  StatePropsDtForm
  & DispatchPropsDtForm
  & OwnPropsDtForm
);

export type PropsDtForm = OutputWithFormProps<
  PropsDtFormWithForm,
  Dt,
  [ Dt ],
  any
>;
export type StateDtForm = {
};
