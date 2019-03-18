import { HandleThunkActionCreator } from 'react-redux';
import { IStateGeoobject } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';

export type InspectionAutobaseSelectCarpoolStateProps = {
  companyList: IStateCompany['companyList'];
  carpoolList: IStateGeoobject['carpoolList'];
};
export type InspectionAutobaseSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionActions.actionGetAndSetInStoreCompany>;
  actionGetAndSetInStoreCarpool: HandleThunkActionCreator<typeof inspectionActions.actionGetAndSetInStoreCarpool>;
  actionResetCompanyAndCarpool: HandleThunkActionCreator<typeof inspectionActions.actionResetCompanyAndCarpool>;
};
export type InspectionAutobaseSelectCarpoolOwnProps = (
  {
    loadingPage: string;
  }
);
export type InspectionAutobaseSelectCarpoolProps = (
  InspectionAutobaseSelectCarpoolStateProps
  & InspectionAutobaseSelectCarpoolDispatchProps
  & InspectionAutobaseSelectCarpoolOwnProps
) & WithSearchProps;
