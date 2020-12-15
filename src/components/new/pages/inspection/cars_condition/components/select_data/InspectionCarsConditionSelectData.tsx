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
import { etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSessionState } from 'redux-main/reducers/selectors';
import { monitoringPermissions } from 'components/new/pages/inspection/_config_data/index';
import { DivNone } from 'global-styled/global-styled';
import { actionChangeRegistryMetaFields } from 'components/new/ui/registry/module/actions-registy';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import SelectCarsConditionOkrug from './select/okrug/SelectCarsConditionOkrug';
import DatePickerRange from 'components/new/pages/inspection/common_components/InspectionDatePickerRange';

type InspectionCarsConditionSelectCarpoolStateProps = {
  fields: OneRegistryData['list']['meta']['fields'];
};
type InspectionCarsConditionSelectCarpoolDispatchProps = {
  actionGetAndSetInStoreCompany: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionGetAndSetInStoreCompany>;
  actionResetCompany: HandleThunkActionCreator<typeof inspectionCarsConditionActions.actionResetCompany>;
  actionChangeRegistryMetaFields: HandleThunkActionCreator<typeof actionChangeRegistryMetaFields>;
};
type InspectionCarsConditionSelectCarpoolOwnProps = {
  loadingPage: string;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
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
  const permissions = etsUseSelector((state) => getSessionState(state).userData.permissionsSet);
  const showAll = permissions.has(monitoringPermissions.all_inspaction) ? { all: true } : {};

  React.useEffect(
    () => {
      props.actionGetAndSetInStoreCompany(showAll, { page: props.loadingPage });

      return () => {
        props.actionResetCompany();
      };
    },
    [],
  );

  const setLocalStorageData = React.useCallback(
    (data) => {
      localStorage.getItem(`monitoringKind`);
      localStorage.setItem('monitoringKind', data);
    }, [props.searchState.monitoringKind]);

  const filteredFields = React.useMemo(() => {
    const carUse
      = ['staff_drivers', 'staff_mechanics', 'list_drivers', 'list_mechanics', 'staffing_drivers', 'staffing_mechanics', 'maintenance', 'repair', 'storage', 'not_used'];
    return props.fields.map((data) => {
      if ('key' in data) {
        return ({
          ...data,
          hidden: carUse.includes(data.key) && props.searchState.monitoringKind !== 'car_use',
        });
      }
    });
  }, [props.searchState.monitoringKind]);

  React.useEffect(() => {
    if (props.searchState.monitoringKind && props.fields.length > 0) {
      setLocalStorageData(props.searchState.monitoringKind);
      props.actionChangeRegistryMetaFields(
        props.loadingPage,
        filteredFields,
        props.searchState.monitoringKind
      );
    }
  }, [props.searchState.monitoringKind, filteredFields]);

  const {
    searchState,
  } = props;
  const companyId = getNumberValueFromSerch(searchState.companyId);

  return (
    <React.Fragment>
      <SelectCarsConditionOkrug />
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
      <DatePickerRange setRefresh={props.setRefresh} />
    </React.Fragment>
  );
};

export default compose<InspectionCarsConditionSelectProps, InspectionCarsConditionSelectCarpoolOwnProps>(
  connect<InspectionCarsConditionSelectCarpoolStateProps, InspectionCarsConditionSelectCarpoolDispatchProps, InspectionCarsConditionSelectCarpoolOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      fields: getListData(getRegistryState(state), loadingPage).meta.fields,
    }),
    (dispatch: any) => ({
      actionChangeRegistryMetaFields: (...arg) => (
        dispatch(
          actionChangeRegistryMetaFields(...arg),
        )
      ),
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
