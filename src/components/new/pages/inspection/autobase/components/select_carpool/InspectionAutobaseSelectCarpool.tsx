import * as React from 'react';
import { compose } from 'recompose';
import { InspectionAutobaseSelectCarpoolProps, InspectionAutobaseSelectCarpoolStateProps, InspectionAutobaseSelectCarpoolDispatchProps, InspectionAutobaseSelectCarpoolOwnProps } from './@types/InspectionAutobaseSelectCarpool';
import { ReduxState } from 'redux-main/@types/state';
import { connect } from 'react-redux';
import inspectionAutobaseActions from 'redux-main/reducers/modules/inspect/autobase/inspect_autobase_actions';
import SelectCarpoolCompany from './select_carpool/company/SelectCarpoolCompany';
import SelectCarpool from './select_carpool/carpool/SelectCarpool';
import withSearch from 'components/new/utils/hooks/hoc/withSearch';

const InspectionAutobaseSelectCarpool: React.FC<InspectionAutobaseSelectCarpoolProps> = (props) => {
  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(
        {},
        { page: props.loadingPage },
      );
      props.actionGetAndSetInStoreCarpool(
        {},
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
      <SelectCarpoolCompany />
      <SelectCarpool />
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
