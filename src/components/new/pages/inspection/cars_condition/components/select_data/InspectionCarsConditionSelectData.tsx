import * as React from 'react';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { connect, HandleThunkActionCreator } from 'react-redux';
import inspectionCarsConditionActions from 'redux-main/reducers/modules/inspect/cars_condition/inspect_cars_condition_actions';
import SelectCarsConditionCompany from './select/company/SelectCarsConditionCompany';
import SelectCarsConditionMonitoringKind from './select/monitoring_kind/SelectCarsConditionMonitoringKind';
import SelectCarsConditionChecksPeriod from './select/checks_period/SelectCarsConditionChecksPeriod';
import SelectCarsConditionChecksType from './select/checks_type/SelectCarsConditionChecksType';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';
import { DivNone } from 'global-styled/global-styled';

type InspectionCarsConditionSelectCarpoolStateProps = {
};
type InspectionCarsConditionSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionGetAndSetInStoreCompany>;
  actionResetCompany: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionResetCompany>;
};
type InspectionCarsConditionSelectCarpoolOwnProps = {
  loadingPage: string;
};
type InspectionCarsConditionSelectCarpoolMergedProps = (
  InspectionCarsConditionSelectCarpoolStateProps
  & InspectionCarsConditionSelectCarpoolDispatchProps
  & InspectionCarsConditionSelectCarpoolOwnProps
);
type InspectionCarsConditionSelectProps = (
  InspectionCarsConditionSelectCarpoolMergedProps
) & WithSearchProps;

const InspectionCarsConditionSelectData: React.FC<InspectionCarsConditionSelectProps> = (props) => {
  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany({}, { page: props.loadingPage });

      return () => {
        props.actionResetCompany();
      };
    },
    [],
  );

  const {
    searchState,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);

  return (
    <React.Fragment>
      <SelectCarsConditionCompany />
      {
        companyId
          ? (
            <React.Fragment>
              <SelectCarsConditionMonitoringKind loadingPage={props.loadingPage} />
              <SelectCarsConditionChecksPeriod loadingPage={props.loadingPage} />
              <SelectCarsConditionChecksType loadingPage={props.loadingPage} />
            </React.Fragment>
          )
          : (
            <DivNone />
          )
      }
    </React.Fragment>
  );
};

export default compose<InspectionCarsConditionSelectProps, InspectionCarsConditionSelectCarpoolOwnProps>(
  connect<InspectionCarsConditionSelectCarpoolStateProps, InspectionCarsConditionSelectCarpoolDispatchProps, InspectionCarsConditionSelectCarpoolOwnProps, ReduxState>(
    null,
    (dispatch: any) => ({
      actionGetAndSetInStoreCompany: (...arg) => (
        dispatch(
          inspectionCarsConditionActions.actionGetAndSetInStoreCompany(...arg),
        )
      ),
      actionResetCompany: (...arg) => (
        dispatch(
          inspectionCarsConditionActions.actionResetCompany(...arg),
        )
      ),
    }),
  ),
  withSearch,
)(InspectionCarsConditionSelectData);
