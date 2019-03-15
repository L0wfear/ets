import { IMaterialConsumptionRateUpd } from 'redux-main/reducers/modules/material_consumption_rate/@types/materialConsumptionRate.h';
import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { HandleThunkActionCreator } from 'react-redux';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsMaterialConsumptionRateFormWrap = {
  showForm: boolean;
  element: IMaterialConsumptionRateUpd | null;
  onFormHide: OnFormHideType;
  type: string | null;

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
    typeof someUniqActions.actionGetAndSetInStoreConsumptionRateMaterial
  >;
  actionResetConsumptionRateMaterial: HandleThunkActionCreator<
    typeof someUniqActions.actionResetConsumptionRateMaterial
  >;
  actionGetAndSetInStoreCleanCategories: HandleThunkActionCreator<
    typeof someUniqActions.actionGetAndSetInStoreCleanCategories
  >;
  actionResetCleanCategories: HandleThunkActionCreator<
    typeof someUniqActions.actionResetCleanCategories
  >;
};

export type OwnMaterialConsumptionRateProps = {
  element: IMaterialConsumptionRateUpd | null;
  handleHide: OnFormHideType;
  page: string;
  path?: string;
  type?: any;
  technicalOperationRegistryList?: any[];
  consumptionRateMaterialList?: any[];
  cleanCategoriesList?: any[];
};

export type PropsMaterialConsumptionRateWithForm = StatePropsMaterialConsumptionRate &
  DispatchPropsMaterialConsumptionRate &
  OwnMaterialConsumptionRateProps;

export type PropsMaterialConsumptionRate = OutputWithFormProps<
  PropsMaterialConsumptionRateWithForm,
  IMaterialConsumptionRateUpd,
  [IMaterialConsumptionRateUpd],
  any
>;
