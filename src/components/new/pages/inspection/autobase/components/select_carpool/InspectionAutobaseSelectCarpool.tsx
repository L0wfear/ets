import * as React from 'react';
import { compose } from 'recompose';
import { InspectionAutobaseSelectCarpoolProps, InspectionAutobaseSelectCarpoolStateProps, InspectionAutobaseSelectCarpoolDispatchProps, InspectionAutobaseSelectCarpoolOwnProps } from './@types/InspectionAutobaseSelectCarpool';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import SelectCarpoolCompany from './select_carpool/company/SelectCarpoolCompany';
import SelectCarpool from './select_carpool/carpool/SelectCarpool';
import SelectAutobaseOkrug from 'components/new/pages/inspection/autobase/components/select_carpool/select_carpool/okrug/SelectAutobaseOkrug';
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { monitoringPermissions } from 'components/new/pages/inspection/_config_data/index';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';
import DatePickerRange from 'components/new/pages/inspection/common_components/InspectionDatePickerRange';

const InspectionAutobaseSelectCarpool: React.FC<InspectionAutobaseSelectCarpoolProps> = (props) => {
  const permissions = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);
  const showAll = permissions.has(monitoringPermissions.all_inspaction);
  const showAllCarPool = showAll ? { all: true } : {};
  const showAllCompanies = showAll ? { for: 'inspect' } : {};

  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(
        showAllCompanies,
        { page: props.loadingPage },
      );
      props.actionGetAndSetInStoreCarpool(
        showAllCarPool,
        { page: props.loadingPage },
      );

      return () => {
        props.actionResetCompanyAndCarpool();
      };
    },
    [],
  );

  return (
    <> 
      <SelectAutobaseOkrug />
      <SelectCarpoolCompany />
      <SelectCarpool />
      <DatePickerRange setRefresh={props.setRefresh} />
    </>
  );
};

export default compose<InspectionAutobaseSelectCarpoolProps, InspectionAutobaseSelectCarpoolOwnProps>(
  withSearch,
  connect<InspectionAutobaseSelectCarpoolStateProps, InspectionAutobaseSelectCarpoolDispatchProps, InspectionAutobaseSelectCarpoolOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionGetAndSetInStoreCarpool: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionGetAndSetInStoreCarpool(...arg),
        )
      ),
      actionResetCompanyAndCarpool: (...arg) => (
        dispatch(
          inspectionAutobaseActions.actionResetCompanyAndCarpool(...arg),
        )
      ),
    }),
  ),
)(InspectionAutobaseSelectCarpool);
