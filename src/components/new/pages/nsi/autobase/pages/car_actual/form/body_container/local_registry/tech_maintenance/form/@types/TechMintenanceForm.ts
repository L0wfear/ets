import {
  TechMaintenance,
  IStateAutobase,
  Car,
} from 'redux-main/reducers/modules/autobase/@types/autobase.h';

import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsTechMaintenanceFormLazy = {
  element: Partial<TechMaintenance>;
  selectedCarData: Car;

  onFormHide: OnFormHideType;

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsTechMaintenance = {
  repairCompanyList: IStateAutobase['repairCompanyList'];
  techMaintOrderList: IStateAutobase['techMaintOrderList'];
};
export type DispatchPropsTechMaintenance = {
  techMaintOrderGetAndSetInStore: any;
  repairCompanyGetAndSetInStore: any;
};
export type OwnTechMaintenanceProps = {
  element: Partial<TechMaintenance>;
  selectedCarData: Car;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsTechMaintenanceWithForm = (
  StatePropsTechMaintenance
  & DispatchPropsTechMaintenance
  & OwnTechMaintenanceProps
);

export type PropsTechMaintenance = OutputWithFormProps<
  PropsTechMaintenanceWithForm,
  TechMaintenance,
  [TechMaintenance],
  any
>;
