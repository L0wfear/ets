
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldCarMissionIdDutyMission,
  StatePropsFieldCarMissionIdDutyMission,
  DispatchPropsFieldCarMissionIdDutyMission,
  OwnPropsFieldCarMissionIdDutyMission,
  StateFieldCarMissionIdDutyMission,
} from 'components/new/pages/missions/duty_mission/form/main/inside_fields/car_mission_id/FieldCarMissionIdDutyMission.d';
import { makeOptionsMissionsForCarMissionId } from './makeOptions';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types/index';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { getMissionsState } from 'redux-main/reducers/selectors/index';

/**
 * Поле "Задание на ТС" для формы наряд-задания
 * Зависит от ТО и плановых дат наряд-задания
 * если !isPermitted, то не будет запроса за ТО
 */
class FieldCarMissionIdDutyMission extends React.PureComponent<PropsFieldCarMissionIdDutyMission, StateFieldCarMissionIdDutyMission> {
  state = {
    MISSION_OPTIONS: [],
  };

  static getDerivedStateFromProps(nextProps: PropsFieldCarMissionIdDutyMission) {
    const {
      value,
      name,
      availableMissionsToBind,
    } = nextProps;

    let MISSION_OPTIONS = makeOptionsMissionsForCarMissionId(
      availableMissionsToBind,
    );

    const notFindSelectedOption = value && !MISSION_OPTIONS.find((mission) => (
      mission.value === value
    ));

    if (notFindSelectedOption) {
      MISSION_OPTIONS = [
        ...MISSION_OPTIONS,
        {
          value,
          label: name,
          rowData: {
            id: value,
            name,
          },
        },
      ];
    }

    return {
      MISSION_OPTIONS,
    };
  }

  componentDidMount() {
    if (this.props.isPermitted) {
      const {
        technical_operation_id,
        plan_date_start,
        plan_date_end,
      } = this.props;

      const triggerOnGetMissions = (
        technical_operation_id
        && plan_date_start
        && plan_date_end
      );

      if (triggerOnGetMissions) {
        this.getMissions();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isPermitted) {
      const {
        value,
        technical_operation_id,
        plan_date_start,
        plan_date_end,
      } = this.props;

      const dependenceDataIsChanged = (
        prevProps.technical_operation_id !== technical_operation_id
        || prevProps.plan_date_start !== plan_date_start
        || prevProps.plan_date_end !== plan_date_end
      );

      if (dependenceDataIsChanged) {
        const triggerOnGetMissions = (
          technical_operation_id
          && plan_date_start
          && plan_date_end
        );

        if (triggerOnGetMissions) {
          this.getMissions();
        } else if (this.props.availableMissionsToBind.length) {
          this.resetAvailableMissionsToBind();
          if (value) {
            this.handleChange(null);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props.isPermitted) {
      this.resetAvailableMissionsToBind();
    }
  }

  resetAvailableMissionsToBind() {
    this.props.actionSetDutyMissionPartialData({
      availableMissionsToBind: [],
    });
  }

  async getMissions() {
    const {
      value,
      technical_operation_id,
      plan_date_start,
      plan_date_end,
      page, path,
    } = this.props;

    const { data } = await this.props.actionGetAndSetInStoreAvalilableMissionsToBind(
      {
        offset: 0,
        technical_operation_id,
        date_from: createValidDateTime(plan_date_start),
        date_to: createValidDateTime(plan_date_end),
        is_archive: false,
      },
      { page, path },
    );

    if (value) {
      if (!data.find(({ id }) => id === value)) {
        this.handleChange(null);
      }
    }
  }

  handleChange = (value: DutyMission['car_mission_id'], option?: ValuesOf<StateFieldCarMissionIdDutyMission['MISSION_OPTIONS']>) => {
    const { props } = this;

    if (value !== props.value) {
      props.onChange({
        car_mission_id: value,
        car_mission_name: get(option, 'label', ''),
      });
    }
  };

  render() {
    const {
      props,
    } = this;

    const {
      MISSION_OPTIONS,
    } = this.state;

    return (
      <ExtField
        id="car-mission-id"
        type="select"
        modalKey={props.page}
        label="Задание на ТС"
        value={props.value}
        error={props.error}
        disabled={props.disabled}
        options={MISSION_OPTIONS}
        onChange={this.handleChange}
      />
    );
  }
}

export default connect<StatePropsFieldCarMissionIdDutyMission, DispatchPropsFieldCarMissionIdDutyMission, OwnPropsFieldCarMissionIdDutyMission, ReduxState>(
  (state) => ({
    availableMissionsToBind: getMissionsState(state).dutyMissionData.availableMissionsToBind,
  }),
  (dispatch: any) => ({
    actionGetAndSetInStoreAvalilableMissionsToBind: (...arg) => (
      dispatch(
        missionsActions.actionGetAndSetInStoreAvalilableMissionsToBind(...arg),
      )
    ),
    actionSetDutyMissionPartialData: (...arg) => (
      dispatch(
        missionsActions.actionSetDutyMissionPartialData(...arg),
      )
    ),
  }),
)(FieldCarMissionIdDutyMission);
