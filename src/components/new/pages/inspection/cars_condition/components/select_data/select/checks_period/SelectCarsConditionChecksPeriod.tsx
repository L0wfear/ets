import * as React from 'react';
import { SelectLabel, InstectionBlockSelect } from 'components/new/pages/inspection/autobase/components/select_carpool/styled/InspectionAutobaseSelectCarpoolStyled';
import { SelectField } from '../../styled/InspectionCarsConditionStyled';
import ExtField from 'components/@next/@ui/renderFields/Field';
import withSearch, { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { compose } from 'recompose';
import { ReduxState } from 'redux-main/@types/state';
import { DispatchProp, connect } from 'react-redux';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import useLastInpectSatus, { INSPECT_STATUS } from 'components/new/pages/inspection/common_components/data/action_menu/useLastInpectSatus';
import { get } from 'lodash';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { checksPeriodSummer, checksPeriodWinter, monitoringKindCarUse } from '../../constants';
import { getLastConductingInspect, getLastCompletedInspect } from 'components/new/pages/inspection/autobase/@selectors';

type SelectCarsConditionChecksPeriodStateProps = {
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};
type SelectCarsConditionChecksPeriodDispatchProps = DispatchProp;
type SelectCarsConditionChecksPeriodOwnProps = {
  loadingPage: string;
};

type SelectCarsConditionChecksPeriodMergeProps = (
  SelectCarsConditionChecksPeriodStateProps
  & SelectCarsConditionChecksPeriodDispatchProps
  & SelectCarsConditionChecksPeriodOwnProps
);
type SelectCarsConditionChecksPeriodProps = (
  SelectCarsConditionChecksPeriodMergeProps
  & WithSearchProps
);

const checksPeriodOptions = [
  { value: checksPeriodSummer.key, label: checksPeriodSummer.title },
  { value: checksPeriodWinter.key, label: checksPeriodWinter.title },
];

const SelectCarsConditionChecksPeriod: React.FC<SelectCarsConditionChecksPeriodProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
    lastConductingInspect,
    lastCompletedInspect,
  } = props;
  const checksPeriod = searchState.checksPeriod;
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

      if (monitoringKind === monitoringKindCarUse.key) {
        if (checksPeriod) {
          setChecksPeriodId(newValue);
        }
      } else {
        if (!checksPeriod || !checksPeriodOptions.find(({ value }) => value === checksPeriod)) {
          newValue = get(checksPeriodOptions, '0.value');
        }
        if (status === INSPECT_STATUS.conditionLast) {
          newValue = (get(lastConductingInspect, 'checks_period', null));
        }
        if (status === INSPECT_STATUS.completedLast) {
          newValue = (get(lastCompletedInspect, 'checks_period', null));
        }

        if (newValue && newValue !== checksPeriod) {
          setChecksPeriodId(newValue);
        }
      }
    },
    [monitoringKind, checksPeriod, status, lastConductingInspect, lastCompletedInspect],
  );

  const setChecksPeriodId = React.useCallback(
    (selectedChecksPeriodId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.checksPeriod = selectedChecksPeriodId;

      setDataInSearch(newPartialSearch);
    },
    [searchState],
  );

  const notSelect = (
    monitoringKind === monitoringKindCarUse.key
  );

  return (
    <InstectionBlockSelect disabled={notSelect}>
      <SelectLabel md={3} sm={2}>
          <h5>
            Период проверки
          </h5>
        </SelectLabel>
        <SelectField md={9} sm={6}>
          <ExtField
            type="select"
            placeholder={notSelect ? '' : undefined}
            label={false}
            value={checksPeriod}
            options={checksPeriodOptions}
            onChange={setChecksPeriodId}
            clearable={false}
            disabled={notSelect || status !== INSPECT_STATUS.noToday}
          />
        </SelectField>
      </InstectionBlockSelect>
  );
};

export default compose<SelectCarsConditionChecksPeriodProps, SelectCarsConditionChecksPeriodOwnProps>(
  connect<SelectCarsConditionChecksPeriodStateProps, SelectCarsConditionChecksPeriodDispatchProps, SelectCarsConditionChecksPeriodOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)) as any,
      lastCompletedInspect: getLastCompletedInspect(getListData(getRegistryState(state), loadingPage)) as any,
    }),
  ),
  withSearch,
)(SelectCarsConditionChecksPeriod);
