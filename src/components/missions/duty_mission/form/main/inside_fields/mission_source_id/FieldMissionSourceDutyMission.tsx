
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldMissionSourceDutyMission,
  StatePropsFieldMissionSourceDutyMission,
  DispatchPropsFieldMissionSourceDutyMission,
  OwnPropsFieldMissionSourceDutyMission,
  StateFieldMissionSourceDutyMission,
} from 'components/missions/duty_mission/form/main/inside_fields/mission_source_id/FieldMissionSourceDutyMission.d';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByMissionSourceForDutyMission } from './makeOptions';
import { isOrderSource } from 'components/missions/duty_mission/form/main/utils';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types/index';

class FieldMissionSourceDutyMission extends React.PureComponent<PropsFieldMissionSourceDutyMission, StateFieldMissionSourceDutyMission> {
  state = {
    MISSION_SOURCE_OPTIONS: (
      makeOptionsByMissionSourceForDutyMission(
        this.props.missionSource.list,
        isOrderSource(this.props.value, this.props.missionSource.order_mission_source_id),
      )
    ),
  };

  handleChange = (value: DutyMission['mission_source_id'], option: ValuesOf<StateFieldMissionSourceDutyMission['MISSION_SOURCE_OPTIONS']>) => (
    this.props.onChange({
      mission_source_id: value,
      mission_source_name: get(option, ['rowData', 'name'], ''),
      mission_source_text: get(option, ['rowData', 'name'], ''),
    })
  )

  render() {
    const {
      props,
    } = this;

    const {
      MISSION_SOURCE_OPTIONS,
    } = this.state;

    return (
      <>
        <ExtField
          id="mission-source-id"
          type="select"
          modalKey={props.page}
          label="Источник получения задания"
          error={props.error}
          disabled={props.disabled}
          options={MISSION_SOURCE_OPTIONS}
          value={props.value}
          onChange={this.handleChange}
        />
      </>
    );
  }
}

export default connect<StatePropsFieldMissionSourceDutyMission, DispatchPropsFieldMissionSourceDutyMission, OwnPropsFieldMissionSourceDutyMission, ReduxState>(
  (state) => ({
    missionSource: getSomeUniqState(state).missionSource,
  }),
)(FieldMissionSourceDutyMission);
