import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';

import { getSomeUniqState, getMissionsState } from 'redux-main/reducers/selectors';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionLoadCleaningOneNorm } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/actions';
import { getValidOneNormPayload } from 'redux-main/reducers/modules/some_uniq/cleaning_one_norm/promise';

type StateProps = {
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
};
type DispatchProps = {
  dispatch: EtsDispatch;
};

type OwnProps = {
  value: Mission['norm_ids'];
  datetime: Mission['date_start'];
  technical_operation_id: Mission['technical_operation_id'];
  municipal_facility_id: Mission['municipal_facility_id'];
  route_type: Mission['route_type'];
  type_ids: Mission['car_type_ids'];

  disabled: boolean;
  onChange: (obj: { [key in keyof Mission]?: Mission[key] }) => void;

  IS_TEMPLATE: boolean;
  MISSION_IS_ORDER_SOURCE: boolean;

  page: string;
  path: string;
};

type Props = (
  StateProps &
  DispatchProps &
  OwnProps
);

class FieldNormIdMission extends React.PureComponent<Props, {}> {
  componentDidUpdate(prevProps: Props) {
    const {
      MISSION_IS_ORDER_SOURCE,
      disabled,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_type,
      type_ids,
    } = this.props;

    const triggerOnUpdate = (
      !disabled &&
      (
        datetime !== prevProps.datetime
        || technical_operation_id !== prevProps.technical_operation_id
        || municipal_facility_id !== prevProps.municipal_facility_id
        || route_type !== prevProps.route_type
        || type_ids !== prevProps.type_ids
      )
    );

    if (triggerOnUpdate) {
      this.updateNormId();
    }

    if (MISSION_IS_ORDER_SOURCE && !disabled && type_ids !== prevProps.type_ids) {
      this.props.onChange({
        norm_ids: type_ids.map(() => this.props.dependeceTechnicalOperation.norm_id),
        norm_text: '',
      });
    }
  }

  async updateNormId() {
    const {
      value,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_type,
      type_ids,
      page,
      path,
    } = this.props;

    const hasAllData =
      datetime && technical_operation_id && municipal_facility_id && route_type && type_ids.length;

    if (hasAllData) {
      const norms = (await Promise.all(
        type_ids.map((func_type_id) => (
          this.props.dispatch(
            actionLoadCleaningOneNorm(
              getValidOneNormPayload({
                datetime: createValidDateTime(datetime),
                technical_operation_id,
                municipal_facility_id,
                route_type,
                needs_brigade: false,
                func_type_id,
                kind_task_ids: 3,
              }),
              {
                page,
                path,
              },
            ),
          )
        )),
      )).filter((d) => d);

      this.props.onChange({
        norm_ids: norms.map(({ norm_id }) => norm_id),
        norm_text: norms.map(({ name }) => name).toString(),
        is_cleaning_norm: norms.some(({ is_cleaning_norm }) => is_cleaning_norm),
      });
    } else if (value.length) {
      this.props.onChange({
        norm_ids: [],
        norm_text: null,
        is_cleaning_norm: false,
      });
    }
  }

  render() {
    return null;
  }
}

export default connect<StateProps, DispatchProps, OwnProps, ReduxState>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state).technicalOperationRegistryForMissionList,
    dependeceTechnicalOperation: getMissionsState(state).missionData.dependeceTechnicalOperation,
  }),
)(FieldNormIdMission);
