import * as React from 'react';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { DispatchProp, connect } from 'react-redux';
import { compose } from 'recompose';
import { getListData } from 'components/new/ui/registry/module/selectors-registry';
import { getRegistryState } from 'redux-main/reducers/selectors';
import useLastInpectSatus, { INSPECT_STATUS } from 'components/new/pages/inspection/common_components/data/action_menu/useLastInpectSatus';
import { DivNone } from 'global-styled/global-styled';
import { get } from 'lodash';
import { LineData, StatusLabel } from 'components/new/pages/inspection/common_components/data/action_menu/styled/InspectionAutobaseDataActionMenu';
import { ReduxState } from 'redux-main/@types/state';
import { getLastConductingInspect, getLastCompletedInspect } from 'components/new/pages/inspection/autobase/@selectors';

type LineDataCarsConditionConditionLastStateProps = {
  lastConductingInspect: InspectCarsCondition;
  lastCompletedInspect: InspectCarsCondition;
};
type LineDataCarsConditionConditionLastDispatchProps = DispatchProp;
type LineDataCarsConditionConditionLastOwnProps = {
  loadingPage: string;
};

type LineDataCarsConditionConditionLastMergeProps = (
  LineDataCarsConditionConditionLastStateProps
  & LineDataCarsConditionConditionLastDispatchProps
  & LineDataCarsConditionConditionLastOwnProps
);
type LineDataCarsConditionConditionLastProps = (
  LineDataCarsConditionConditionLastMergeProps
);

const LineDataCarsConditionConditionLast: React.FC<LineDataCarsConditionConditionLastProps> = React.memo(
  (props) => {
    const {
      lastConductingInspect,
      lastCompletedInspect,
    } = props;

    const {
      status,
    } = useLastInpectSatus(
      lastConductingInspect,
      lastCompletedInspect,
    );

    return (
      status === INSPECT_STATUS.conditionLast
        ? (
          <LineData>
            <div>
              <span>Заполнено:</span>
              <StatusLabel>{`${get(lastConductingInspect, 'checked_cars_cnt', 0)}/${get(lastConductingInspect, 'cars_cnt', 0)}`}</StatusLabel>
              <span>карточек ТС</span>
            </div>
          </LineData>
        )
        : (
          <DivNone />
        )
    );
  },
);

export default compose<LineDataCarsConditionConditionLastProps, LineDataCarsConditionConditionLastOwnProps>(
  connect<LineDataCarsConditionConditionLastStateProps, LineDataCarsConditionConditionLastDispatchProps, LineDataCarsConditionConditionLastOwnProps, ReduxState>(
    (state, { loadingPage }) => ({
      lastConductingInspect: getLastConductingInspect(getListData(getRegistryState(state), loadingPage)) as any,
      lastCompletedInspect: getLastCompletedInspect(getListData(getRegistryState(state), loadingPage)) as any,
    }),
  ),
)(LineDataCarsConditionConditionLast);
