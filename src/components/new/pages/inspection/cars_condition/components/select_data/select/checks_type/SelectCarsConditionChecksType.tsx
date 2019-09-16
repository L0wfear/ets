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
import { checksTypePlanned, checksTypeCheckOut } from '../../constants';
import { getLastConductingInspect, getLastCompletedInspect } from 'components/new/pages/inspection/autobase/@selectors';

type SelectCarsConditionChecksTypeStateProps = {
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};
type SelectCarsConditionChecksTypeDispatchProps = DispatchProp;
type SelectCarsConditionChecksTypeOwnProps = {
  loadingPage: string;
};

type SelectCarsConditionChecksTypeMergeProps = (
  SelectCarsConditionChecksTypeStateProps
  & SelectCarsConditionChecksTypeDispatchProps
  & SelectCarsConditionChecksTypeOwnProps
);
type SelectCarsConditionChecksTypeProps = (
  SelectCarsConditionChecksTypeMergeProps
  & WithSearchProps
);

const checksTypeOptions = [
  { value: checksTypePlanned.key, label: checksTypePlanned.title },
  { value: checksTypeCheckOut.key, label: checksTypeCheckOut.title },
];

const SelectCarsConditionChecksType: React.FC<SelectCarsConditionChecksTypeProps> = (props) => {
  const {
    searchState,
    setDataInSearch,
    lastConductingInspect,
    lastCompletedInspect,
  } = props;

  const checksType = searchState.checksType;

  const {
    status,
  } = useLastInpectSatus(
    lastConductingInspect,
    lastCompletedInspect,
  );

  React.useEffect(
    () => {
      let newValue = null;
      if (!checksType || !checksTypeOptions.find(({ value }) => value === checksType)) {
        newValue = get(checksTypeOptions, '0.value');
      }
      if (status === INSPECT_STATUS.conditionLast) {
        newValue = (get(lastConductingInspect, 'checks_type', null));
      }
      if (status === INSPECT_STATUS.completedLast) {
        newValue = (get(lastCompletedInspect, 'checks_type', null));
      }

      if (newValue && newValue !== checksType) {
        setChecksTypeId(newValue);
      }
    },
    [checksType, status, lastConductingInspect, lastCompletedInspect],
  );

  const setChecksTypeId = React.useCallback(
    (selectedChecksTypeId: number) => {
      const newPartialSearch: any = {
        ...searchState,
      };

      newPartialSearch.checksType = selectedChecksTypeId;

      setDataInSearch(newPartialSearch);
    },
    [searchState, props.match.params],
  );

  return (
    <InstectionBlockSelect>
      <SelectLabel md={3} sm={2}>
          <h5>
            Тип проверки
          </h5>
        </SelectLabel>
        <SelectField md={9} sm={6}>
          <ExtField
            type="select"
            label={false}
            value={checksType}
            options={checksTypeOptions}
            onChange={setChecksTypeId}
            clearable={false}
            disabled={status !== INSPECT_STATUS.noToday}
          />
        </SelectField>
      </InstectionBlockSelect>
  );
};

export default compose<SelectCarsConditionChecksTypeProps, SelectCarsConditionChecksTypeOwnProps>(
  connect<SelectCarsConditionChecksTypeStateProps, SelectCarsConditionChecksTypeDispatchProps, SelectCarsConditionChecksTypeOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)) as any,
      lastCompletedInspect: getLastCompletedInspect(getListData(getRegistryState(state), loadingPage)) as any,
    }),
  ),
  withSearch,
)(SelectCarsConditionChecksType);
