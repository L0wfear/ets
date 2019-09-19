import * as React from 'react';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionCarsConditionStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { getRegistryState } from 'redux-main/reducers/selectors';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { DispatchProp, connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import useLastInpectSatus, { INSPECT_STATUS } from 'components/new/pages/inspection/common_components/data/action_menu/useLastInpectSatus';
import { get } from 'lodash';
import { monitoringKindSeasonReadiness, monitoringKindCarUse } from '../../constants';
import { getLastConductingInspect, getLastCompletedInspect } from 'components/new/pages/inspection/autobase/@selectors';

type SelectCarsConditionMonitoringKindStateProps = {
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};
type SelectCarsConditionMonitoringKindDispatchProps = DispatchProp;
type SelectCarsConditionMonitoringKindOwnProps = {
  loadingPage: string;
};

type SelectCarsConditionMonitoringKindMergeProps = (
  SelectCarsConditionMonitoringKindStateProps
  & SelectCarsConditionMonitoringKindDispatchProps
  & SelectCarsConditionMonitoringKindOwnProps
);
type SelectCarsConditionMonitoringKindProps = (
  SelectCarsConditionMonitoringKindMergeProps
  & WithSearchProps
);

const monitoringKindOptions = [
  { value: monitoringKindSeasonReadiness.key, label: monitoringKindSeasonReadiness.title },
  { value: monitoringKindCarUse.key, label: monitoringKindCarUse.title },
];

const SelectCarsConditionMonitoringKind: React.FC<SelectCarsConditionMonitoringKindProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
    lastConductingInspect,
    lastCompletedInspect,
  } = props;

  const monitoringKind = searchState.monitoringKind;

  const {
    status,
  } = useLastInpectSatus(
    lastConductingInspect,
    lastCompletedInspect,
  );

  React.useEffect(
    () => {
      let newValue = null;
      if (!monitoringKind || !monitoringKindOptions.find(({ value }) => value === monitoringKind)) {
        newValue = get(monitoringKindOptions, '1.value');
      }
      if (status === INSPECT_STATUS.conditionLast) {
        newValue = (get(lastConductingInspect, 'monitoring_kind', null));
      }
      if (status === INSPECT_STATUS.completedLast) {
        newValue = (get(lastCompletedInspect, 'monitoring_kind', null));
      }

      if (newValue && newValue !== monitoringKind) {
        setMonitoringKindId(newValue);
      }
    },
    [monitoringKind, status, lastConductingInspect, lastCompletedInspect],
  );

  const setMonitoringKindId = React.useCallback(
    (selectedMonitoringKindId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.monitoringKind = selectedMonitoringKindId;

      setDataInSearch(newPartialSearch);
    },
    [searchState, props.match.params],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={3}>
        <h5>
          Вид мониторинга
        </h5>
      </SelectLabel>
      <SelectField md={9} sm={7}>
        <ExtField
          type="select"
          label={false}
          value={monitoringKind}
          options={monitoringKindOptions}
          onChange={setMonitoringKindId}
          clearable={false}
          disabled={status !== INSPECT_STATUS.noToday}
        />
      </SelectField>
    </InstectionBlockSelect>
  );
};

export default compose<SelectCarsConditionMonitoringKindProps, SelectCarsConditionMonitoringKindOwnProps>(
  connect<SelectCarsConditionMonitoringKindStateProps, SelectCarsConditionMonitoringKindDispatchProps, SelectCarsConditionMonitoringKindOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)) as any,
      lastCompletedInspect: getLastCompletedInspect(getListData(getRegistryState(state), loadingPage)) as any,
    }),
  ),
  withSearch,
)(SelectCarsConditionMonitoringKind);
