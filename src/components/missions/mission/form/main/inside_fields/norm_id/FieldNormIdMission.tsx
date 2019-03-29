import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldNormIdMission,
  StatePropsFieldNormIdMission,
  DispatchPropsFieldNormIdMission,
  OwnPropsFieldNormIdMission,
  StateFieldNormIdMission,
} from 'components/missions/mission/form/main/inside_fields/norm_id/FieldNormIdMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState, getMissionsState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';
import { createValidDateTime } from 'utils/dates';
import routesActions from 'redux-main/reducers/modules/routes/actions';

class FieldNormIdMission extends React.PureComponent<
  PropsFieldNormIdMission,
  StateFieldNormIdMission
> {
  componentDidUpdate(prevProps: PropsFieldNormIdMission) {
    const {
      MISSION_IS_ORDER_SOURCE,
      disabled,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_id,
      type_ids,
    } = this.props;

    const triggerOnUpdate = (
      !MISSION_IS_ORDER_SOURCE &&
      !disabled &&
      (
        datetime !== prevProps.datetime
        || technical_operation_id !== prevProps.technical_operation_id
        || municipal_facility_id !== prevProps.municipal_facility_id
        || route_id !== prevProps.route_id
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
      route_id,
      type_ids,
      page,
      path,
    } = this.props;

    const hasAllData =
      datetime && technical_operation_id && municipal_facility_id && route_id && type_ids.length;

    if (hasAllData) {
      const route_data = await this.props.actionLoadRouteById(route_id, {
        page,
        path,
      });

      const norms = await Promise.all(
        type_ids.map((func_type_id) => (
          this.props.actionLoadCleaningOneNorm(
            {
              datetime: createValidDateTime(datetime),
              technical_operation_id,
              municipal_facility_id,
              route_type: route_data.type,
              needs_brigade: false,
              func_type_id,
              kind_task_ids: 3,
            },
            {
              page,
              path,
            },
          )
        )),
      );

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
    return <DivNone>norm_id</DivNone>;
  }
}

export default connect<
  StatePropsFieldNormIdMission,
  DispatchPropsFieldNormIdMission,
  OwnPropsFieldNormIdMission,
  ReduxState
>(
  (state) => ({
    technicalOperationRegistryForMissionList: getSomeUniqState(state)
      .technicalOperationRegistryForMissionList,
    dependeceTechnicalOperation: getMissionsState(state).missionData.dependeceTechnicalOperation,
  }),
  (dispatch: any) => ({
    actionLoadRouteById: (...arg) =>
      dispatch(routesActions.actionLoadRouteById(...arg)),
    actionLoadCleaningOneNorm: (...arg) =>
      dispatch(someUniqActions.actionLoadCleaningOneNorm(...arg)),
  }),
)(FieldNormIdMission);
