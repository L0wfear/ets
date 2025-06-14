import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/old/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { getFormattedDateTime } from 'components/@next/@utils/dates/dates';
import { NO_DATA_TEXT } from 'constants/statuses';

import TimeParking from 'components/old/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/missions-list/time-parking/TimeParking';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import { ReduxState } from 'redux-main/@types/state';

type PropsCarMissions = {
  showMissionInfoForm: any;
  showMissionForm: any;
  missions: Array<any>;
};

class MissionsList extends React.Component<PropsCarMissions, {}> {
  showMissionInfoForm: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionInfoForm(Number(id))
  );
  setMissionById: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionForm(Number(id))
  );

  render() {
    const { missions: { length }, missions } = this.props;

    return (
      <div className="car_info-missions_list_container">
        {
          length === 0
            ? (
              <div className="center-preloader">
                <div>{NO_DATA_TEXT}</div>
              </div>
            )
            :        (
              missions.map((mission, index) => {
                return (
                  <div key={mission.id + index} className={'car_info_mission_data_container'}>
                    <div className="car_info_mission_container">
                      <div
                        data-id={mission.id}
                        onClick={this.setMissionById}
                        className={'mission_title'}
                      >
                        {`№${mission.number} - ${mission.technical_operation_name}`}
                      </div>
                      <div className={'mission_vehicle_info'}>Время стоянок: <TimeParking date_start={mission.date_start} date_end={mission.date_end}/></div>
                      <div className={'mission_vehicle_info'}>{`Процент выполнения задания, %: ${mission.traveled_percentage}`}</div>
                      { length >= 1
                        ? ([
                          <div key="date-start" className={'mission_vehicle_info'}>{`Начало задания: ${getFormattedDateTime(mission.date_start)}`}</div>,
                          <div key="date-end" className={'mission_vehicle_info'}>{`Окончание задания: ${getFormattedDateTime(mission.date_end)}`}</div>,
                        ])
                        :                    (
                          <div />
                        )
                      }
                    </div>
                    <EtsBootstrap.Glyphicon glyph="info-sign" className="pointer fontSize24" data-id={mission.id} onClick={this.showMissionInfoForm} />
                  </div>
                );
              })
            )
        }
      </div>
    );
  }
}

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'missionsAndWaybillsData', 'missions'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'missionsAndWaybillsData', 'error'],
  }),
  connect<any, any, any, ReduxState>(
    (state) => ({
      missions: state.monitorPage.carInfo.missionsAndWaybillsData.missions,
    }),
  ),
)(MissionsList);
