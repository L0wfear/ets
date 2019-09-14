import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { actionGetAndSetInStoreMaintenanceWork, actionResetMaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/actions';
import { actionGetAndSetInStoreCleanCategories, actionResetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/actions';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

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
    typeof actionGetAndSetInStoreMaintenanceWork
  >;
  actionResetMaintenanceWork: HandleThunkActionCreator<
    typeof actionResetMaintenanceWork
  >;
  actionGetAndSetInStoreCleanCategories: HandleThunkActionCreator<
    typeof actionGetAndSetInStoreCleanCategories
  >;
  actionResetCleanCategories: HandleThunkActionCreator<
    typeof actionResetCleanCategories
  >;
};

export type OwnMaintenanceRateProps = WithFormRegistrySearchAddProps<MaintenanceRate>;

export type PropsMaintenanceRateWithForm = StatePropsMaintenanceRate &
  DispatchPropsMaintenanceRate &
  OwnMaintenanceRateProps;

export type PropsMaintenanceRate = OutputWithFormProps<
  PropsMaintenanceRateWithForm,
  any,
  [any],
  any
>;
