import { HandleThunkActionCreator } from 'react-redux';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';

export type InspectionAutobaseSelectCarpoolStateProps = {
};
export type InspectionAutobaseSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionGetAndSetInStoreCompany>;
  actionGetAndSetInStoreCarpool: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionGetAndSetInStoreCarpool>;
  actionResetCompanyAndCarpool: HandleThunkActionCreator<typeof inspectionAutobaseActions.actionResetCompanyAndCarpool>;
};
export type InspectionAutobaseSelectCarpoolOwnProps = {
  loadingPage: string;
};
export type InspectionAutobaseSelectMergedProps = (
  InspectionAutobaseSelectCarpoolStateProps
  & InspectionAutobaseSelectCarpoolDispatchProps
  & InspectionAutobaseSelectCarpoolOwnProps
);

export type InspectionAutobaseSelectCarpoolProps = (
  InspectionAutobaseSelectMergedProps
);
