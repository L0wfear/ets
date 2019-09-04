import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { HandleThunkActionCreator } from 'react-redux';
import { MaterialConsumptionRate } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import { actionResetConsumptionRateMaterial, actionGetAndSetInStoreConsumptionRateMaterial } from 'redux-main/reducers/modules/some_uniq/material_consumption_rate/actions';
import { actionGetAndSetInStoreCleanCategories, actionResetCleanCategories } from 'redux-main/reducers/modules/some_uniq/clean_categories/actions';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsMaterialConsumptionRateFormLazy = {
  showForm: boolean;
  element: Partial<MaterialConsumptionRate>;
  onFormHide: OnFormHideType;

  registryKey?: string;
  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsMaterialConsumptionRate = {
  technicalOperationRegistryList: IStateSomeUniq['technicalOperationRegistryList'];
  consumptionRateMaterialList: IStateSomeUniq['consumptionRateMaterialList'];
  cleanCategoriesList: IStateSomeUniq['cleanCategoriesList'];
};

export type DispatchPropsMaterialConsumptionRate = {
  actionGetAndSetInStoreTechnicalOperationRegistry: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreTechnicalOperationRegistry
  >;
  actionResetTechnicalOperationRegistry: HandleThunkActionCreator<
    typeof someUniqActions.actionResetTechnicalOperationRegistry
  >;
  actionGetAndSetInStoreConsumptionRateMaterial: HandleThunkActionCreator<
    typeof actionGetAndSetInStoreConsumptionRateMaterial
  >;
  actionResetConsumptionRateMaterial: HandleThunkActionCreator<
    typeof actionResetConsumptionRateMaterial
  >;
  actionGetAndSetInStoreCleanCategories: HandleThunkActionCreator<
    typeof actionGetAndSetInStoreCleanCategories
  >;
  actionResetCleanCategories: HandleThunkActionCreator<
    typeof actionResetCleanCategories
  >;
};

export type OwnMaterialConsumptionRateProps = {
  element: Partial<MaterialConsumptionRate>;
  handleHide: OnFormHideType;
  page: string;
  path?: string;
};

export type PropsMaterialConsumptionRateWithForm = StatePropsMaterialConsumptionRate &
  DispatchPropsMaterialConsumptionRate &
  OwnMaterialConsumptionRateProps;

export type PropsMaterialConsumptionRate = OutputWithFormProps<
  PropsMaterialConsumptionRateWithForm,
  any,
  [any],
  any
>;
