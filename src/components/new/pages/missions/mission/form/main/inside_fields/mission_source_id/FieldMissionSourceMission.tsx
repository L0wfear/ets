
import * as React from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';

import { ExtField } from 'components/ui/new/field/ExtField';
import { ReduxState } from 'redux-main/@types/state';
import {
  PropsFieldMissionSourceMission,
  StatePropsFieldMissionSourceMission,
  DispatchPropsFieldMissionSourceMission,
  OwnPropsFieldMissionSourceMission,
  StateFieldMissionSourceMission,
} from 'components/new/pages/missions/mission/form/main/inside_fields/mission_source_id/FieldMissionSourceMission.h';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { makeOptionsByMissionSourceForMission } from './makeOptions';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types/index';

import { DivNone } from 'global-styled/global-styled';
import { isOrderSource } from 'components/new/pages/missions/utils';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class FieldMissionSourceMission extends React.PureComponent<PropsFieldMissionSourceMission, StateFieldMissionSourceMission> {
  state = {
    MISSION_SOURCE_OPTIONS: (
      makeOptionsByMissionSourceForMission(
        this.props.missionSource.list,
        isOrderSource(this.props.value, this.props.missionSource.order_mission_source_id),
      )
    ),
  };

  handleChange = (value: Mission['mission_source_id'], option: ValuesOf<StateFieldMissionSourceMission['MISSION_SOURCE_OPTIONS']>) => (
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
      request_id,
      request_number,
    } = props;

    const {
      MISSION_SOURCE_OPTIONS,
    } = this.state;

    return (
      <EtsBootstrap.Row>
        <EtsBootstrap.Col md={request_id ? 6 : 12}>
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
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={request_id ? 6 : 0}>
          {
            request_id
              ? (
                <ExtField
                  type="string"
                  label="Номер заявки"
                  value={request_number}
                  disabled
                />
              )
              : (
                <DivNone />
              )
          }
        </EtsBootstrap.Col>
      </EtsBootstrap.Row>
    );
  }
}

export default connect<StatePropsFieldMissionSourceMission, DispatchPropsFieldMissionSourceMission, OwnPropsFieldMissionSourceMission, ReduxState>(
  (state) => ({
    missionSource: getSomeUniqState(state).missionSource,
  }),
)(FieldMissionSourceMission);
