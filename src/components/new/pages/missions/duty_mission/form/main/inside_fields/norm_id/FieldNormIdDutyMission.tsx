import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

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
      disabled,
      datetime,
      technical_operation_id,
      municipal_facility_id,
      route_type,
      DUTY_MISSION_IS_ORDER_SOURCE,
    } = this.props;

    const triggerOnUpdate =
      !DUTY_MISSION_IS_ORDER_SOURCE &&
      !disabled &&
      (datetime !== prevProps.datetime ||
        technical_operation_id !== prevProps.technical_operation_id ||
        municipal_facility_id !== prevProps.municipal_facility_id ||
        route_type !== prevProps.route_type);

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
      route_type,
      page,
      path,
    } = this.props;

    const hasAllData = datetime && technical_operation_id && municipal_facility_id && route_type;

    if (hasAllData) {
      const payload = {
        datetime: createValidDateTime(datetime),
        technical_operation_id,
        municipal_facility_id,
        route_type,
        needs_brigade: true,
        kind_task_ids: 3,
      };

      try {
        const oneNorm = await this.props.actionLoadCleaningOneNorm(payload, {
          page,
          path,
        });

        this.props.onChange({
          norm_id: get(oneNorm, 'norm_id', null),
          norm_text: get(oneNorm, 'name', null),
          is_cleaning_norm: get(oneNorm, 'is_cleaning_norm', null),
        });
      } catch (error) {
        this.props.onChange({
          norm_id: null,
          norm_text: null,
          is_cleaning_norm: false,
        });
      }
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
    actionLoadCleaningOneNorm: (...arg) =>
      dispatch(someUniqActions.actionLoadCleaningOneNorm(...arg)),
  }),
)(FieldNormIdDutyMission);
