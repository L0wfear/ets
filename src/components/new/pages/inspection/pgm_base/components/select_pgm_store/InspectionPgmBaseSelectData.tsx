import * as React from 'react';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { connect, HandleThunkActionCreator } from 'react-redux';
import SelectPgmBaseOkrug from './select/okrug/SelectPgmBaseOkrug';
import inspectionPgmBaseActions from 'redux-main/reducers/modules/inspect/pgm_base/inspect_pgm_base_actions';
import SelectPgmBaseCompany from './select/company/SelectPgmBaseCompany';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import SelectPgmBaseAddress from './select/address/SelectPgmBaseAddress';
import SelectPgmBaseTypeId from './select/pgm_store_type_id/SelectPgmBaseTypeId';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { monitoringPermissions } from 'components/new/pages/inspection/_config_data/index';
import DatePickerRange from 'components/new/pages/inspection/common_components/InspectionDatePickerRange';

type InspectionPgmBaseSelectCarpoolStateProps = {};
type InspectionPgmBaseSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionGetAndSetInStoreCompany>;
  actionGetAndSetInStorePgmBase: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionGetAndSetInStorePgmBase>;
  actionResetCompanyAndCarpool: HandleThunkActionCreator<typeof inspectionPgmBaseActions.actionResetCompanyAndCarpool>;
};
type InspectionPgmBaseSelectCarpoolOwnProps = {
  loadingPage: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
type InspectionPgmBaseSelectCarpoolMergedProps = (
  InspectionPgmBaseSelectCarpoolStateProps
  & InspectionPgmBaseSelectCarpoolDispatchProps
  & InspectionPgmBaseSelectCarpoolOwnProps
);
type InspectionPgmBaseSelectCarpoolProps = (
  InspectionPgmBaseSelectCarpoolMergedProps
);

const InspectionPgmBaseSelectData: React.FC<InspectionPgmBaseSelectCarpoolProps> = (props) => {
  const permissions = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);
  const showAll = permissions.has(monitoringPermissions.all_inspaction);
  const showAllPgmBase = showAll ? { all: true } : {};
  const showAllCompanies = showAll ? { for: 'inspect' } : {};

  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(showAllCompanies, { page: props.loadingPage });
      props.actionGetAndSetInStorePgmBase(showAllPgmBase, { page: props.loadingPage });

      return () => {
        props.actionResetCompanyAndCarpool();
      };
    },
    [],
  );

  return (
    <>
      <SelectPgmBaseOkrug />
      <SelectPgmBaseCompany />
      <SelectPgmBaseAddress />
      <SelectPgmBaseTypeId />
      <DatePickerRange setRefresh={props.setRefresh} />
    </>
  );
};

export default compose<InspectionPgmBaseSelectCarpoolProps, InspectionPgmBaseSelectCarpoolOwnProps>(
  withSearch,
  connect<InspectionPgmBaseSelectCarpoolStateProps, InspectionPgmBaseSelectCarpoolDispatchProps, InspectionPgmBaseSelectCarpoolOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionGetAndSetInStorePgmBase: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionGetAndSetInStorePgmBase(...arg),
        )
      ),
      actionResetCompanyAndCarpool: (...arg) => (
        dispatch(
          inspectionPgmBaseActions.actionResetCompanyAndCarpool(...arg),
        )
      ),
    }),
  ),
)(InspectionPgmBaseSelectData);
