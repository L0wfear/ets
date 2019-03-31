import { HandleThunkActionCreator } from 'react-redux';
import { IStateGeoobject } from 'redux-main/reducers/modules/geoobject/@types/geoobject.h';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import inspectionActions from 'redux-main/reducers/modules/inspect/inspect_actions';

export type InspectionPgmBaseSelectCarpoolStateProps = {
  companyList: IStateCompany['companyList'];
  pgmBaseList: IStateGeoobject['pgmStoreList'];
};
export type InspectionPgmBaseSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionActions.actionGetAndSetInStoreCompany>;
  actionGetAndSetInStorePgmBase: HandleThunkActionCreator<typeof inspectionActions.actionGetAndSetInStorePgmBase>;
  actionResetCompanyAndCarpool: HandleThunkActionCreator<typeof inspectionActions.actionResetCompanyAndCarpool>;
};
export type InspectionPgmBaseSelectCarpoolOwnProps = (
  {
    loadingPage: string;
  }
);
export type InspectionPgmBaseSelectCarpoolProps = (
  InspectionPgmBaseSelectCarpoolStateProps
  & InspectionPgmBaseSelectCarpoolDispatchProps
  & InspectionPgmBaseSelectCarpoolOwnProps
) & WithSearchProps;
