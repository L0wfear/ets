import { IMaintenanceRateUpd } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsMaintenanceRateFormWrap = {
  showForm: boolean;
  element: IMaintenanceRateUpd | null;
  onFormHide: OnFormHideType;
  type: string | null;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsMaintenanceRate = {
};
export type DispatchPropsMaintenanceRate = {
  createAction: any;
  updateAction: any;
};
export type OwnMaintenanceRateProps = {
  element: IMaintenanceRateUpd | null;
  handleHide: OnFormHideType;
  page?: string;
  path?: string;
  type?: any;
  technicalOperationsList?: any[];
  maintenanceWorkList?: any[];
  cleanCategoriesList?: any[];
};

export type PropsMaintenanceRateWithForm = (
  StatePropsMaintenanceRate
  & DispatchPropsMaintenanceRate
  & OwnMaintenanceRateProps
);

export type PropsMaintenanceRate = OutputWithFormProps<
  PropsMaintenanceRateWithForm,
  IMaintenanceRateUpd,
  [ IMaintenanceRateUpd ],
  any
>;
export type StateMaintenanceRate = {
};
