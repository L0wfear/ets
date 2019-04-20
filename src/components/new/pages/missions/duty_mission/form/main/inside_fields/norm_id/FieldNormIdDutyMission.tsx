import * as React from 'react';
import { connect } from 'react-redux';

import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldNormIdDutyMission,
  StatePropsFieldNormIdDutyMission,
  DispatchPropsFieldNormIdDutyMission,
  OwnPropsFieldNormIdDutyMission,
  StateFieldNormIdDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/norm_id/FieldNormIdDutyMission.d';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { DivNone } from 'global-styled/global-styled';
import { createValidDateTime } from 'utils/dates';
import routesActions from 'redux-main/reducers/modules/routes/actions';

/**
 * Пустой рендер для вычисления норматива (norm_id)
 * Зависит от ТО, Элемента, маршурта и даты начала
 */
class FieldNormIdDutyMission extends React.PureComponent<
  PropsFieldNormIdDutyMission,
  StateFieldNormIdDutyMission
> {
  componentDidUpdate(prevProps: PropsFieldNormIdDutyMission) {
    const {
      DUTY_MISSION_IS_ORDER_SOURCE,
      disabled,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_id,
    } = this.props;

    const triggerOnUpdate =
      !DUTY_MISSION_IS_ORDER_SOURCE &&
      !disabled &&
      (datetime !== prevProps.datetime ||
        technical_operation_id !== prevProps.technical_operation_id ||
        municipal_facility_id !== prevProps.municipal_facility_id ||
        route_id !== prevProps.route_id);

    if (triggerOnUpdate) {
      this.updateNormId();
    }
  }

  async updateNormId() {
    const {
      value,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_id,
      page,
      path,
    } = this.props;

    const hasAllData = datetime && technical_operation_id && municipal_facility_id && route_id;

    if (hasAllData) {
      const route_data = await this.props.actionLoadRouteById(route_id, {
        page,
        path,
      });

      const payload = {
        datetime: createValidDateTime(datetime),
        technical_operation_id,
        municipal_facility_id,
        route_type: route_data.type,
        needs_brigade: true,
        kind_task_ids: 3,
      };

      const oneNorm = await this.props.actionLoadCleaningOneNorm(payload, {
        page,
        path,
      });

      this.props.onChange({
        norm_id: oneNorm.norm_id,
        norm_text: oneNorm.name,
        is_cleaning_norm: oneNorm.is_cleaning_norm,
      });
    } else if (value) {
      this.props.onChange({
        norm_id: null,
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
  StatePropsFieldNormIdDutyMission,
  DispatchPropsFieldNormIdDutyMission,
  OwnPropsFieldNormIdDutyMission,
  ReduxState
>(
  (state) => ({
    technicalOperationRegistryForDutyMissionList: getSomeUniqState(state)
      .technicalOperationRegistryForDutyMissionList,
  }),
  (dispatch: any) => ({
    actionLoadRouteById: (...arg) =>
      dispatch(routesActions.actionLoadRouteById(...arg)),
    actionLoadCleaningOneNorm: (...arg) =>
      dispatch(someUniqActions.actionLoadCleaningOneNorm(...arg)),
  }),
)(FieldNormIdDutyMission);
