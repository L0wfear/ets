import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import { compose } from 'recompose';
import { getFormattedDateTime } from 'utils/dates';
import * as Glyphicon from 'react-bootstrap/lib/Glyphicon';
import { NO_DATA_TEXT } from 'constants/statuses';

import TimeParking from 'components/monitor/info/car-info/car-tab-menu/car-attribute-information/car-missions/missions-list/time-parking/TimeParking';

type PropsCarMissions = {
  showMissionInfoForm: any;
  showMissionForm: any;
  missions: any[],
};

class MissionsList extends React.Component<PropsCarMissions, {}> {
  showMissionInfoForm: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionInfoForm(Number(id))
  )
  setMissionById: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionForm(Number(id))
  )

  render() {

    const { missions: { length }, missions } = this.props;

    return (
      <div className="car_info-missions_list_container">
      {
        length === 0 ?
        (
          <div className="center-preloader">
            <div>{NO_DATA_TEXT}</div>
          </div>
        )
        :
        (
          missions.map((mission) => {
            return (
              <div key={mission.id} className={'car_info_mission_container'}>
                <div>
                  <div
                    data-id={mission.id}
                    onClick={this.setMissionById}
                    className={'mission_title'}
                  >
                    {`№${mission.number} - ${mission.technical_operation_name}`}
                  </div>
                  <div className={'mission_vehicle_info'}>Время стоянок: <TimeParking date_start={mission.date_start} date_end={mission.date_end}/></div>
                  <div className={'mission_vehicle_info'}>{`Процент выполнения задания, %: ${mission.traveled_percentage}`}</div>
                  { length > 1 ?
                    ([
                      <div key="date-start" className={'mission_vehicle_info'}>{`Дата начала: ${getFormattedDateTime(mission.date_start)}`}</div>,
                      <div key="date-end" className={'mission_vehicle_info'}>{`Дата окончания: ${getFormattedDateTime(mission.date_end)}`}</div>,
                    ])
                    :
                    (
                      <div />
                    )
                  }
                </div>
                <Glyphicon glyph="info-sign" className="pointer fontSize24" data-id={mission.id} onClick={this.showMissionInfoForm} />
              </div>
            );
          })
        )
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  missions: state.monitorPage.carInfo.missionsData.missions,
});

export default compose<any, any>(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'missionsData', 'missions'],
    type: 'loader-field',
    checkErrorPath: ['monitorPage', 'carInfo', 'missionsData', 'error'],
  }),
  connect(
    mapStateToProps,
  ),
)(MissionsList);
