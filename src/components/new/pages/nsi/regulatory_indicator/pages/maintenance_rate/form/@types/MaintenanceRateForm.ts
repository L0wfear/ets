import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { HandleThunkActionCreator } from 'react-redux';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsMaintenanceRateFormLazy = {
  element: Partial<MaintenanceRate>;
  onFormHide: OnFormHideType;
  type: string | null;

  registryKey?: string;
  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsMaintenanceRate = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
  maintenanceWorkList: IStateSomeUniq['maintenanceWorkList'];
  cleanCategoriesList: IStateSomeUniq['cleanCategoriesList'];
};

export type DispatchPropsMaintenanceRate = {
  actionGetAndSetInStoreTechnicalOperationRegistry: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistry
  >;
  actionResetTechnicalOperationRegistry: HandleThunkActionCreator<
    typeof someUniqActions.actionResetTechnicalOperationRegistry
  >;
  actionGetAndSetInStoreMaintenanceWork: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreMaintenanceWork
  >;
  actionResetMaintenanceWork: HandleThunkActionCreator<
    typeof someUniqActions.actionResetMaintenanceWork
  >;
  actionGetAndSetInStoreCleanCategories: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreCleanCategories
  >;
  actionResetCleanCategories: HandleThunkActionCreator<
    typeof someUniqActions.actionResetCleanCategories
  >;
};

export type OwnMaintenanceRateProps = {
  element: Partial<MaintenanceRate>;
  handleHide: OnFormHideType;
  page: string;
  path?: string;
  type?: any;
};

export type PropsMaintenanceRateWithForm = StatePropsMaintenanceRate &
  DispatchPropsMaintenanceRate &
  OwnMaintenanceRateProps;

export type PropsMaintenanceRate = OutputWithFormProps<
  PropsMaintenanceRateWithForm,
  any,
  [any],
  any
>;
