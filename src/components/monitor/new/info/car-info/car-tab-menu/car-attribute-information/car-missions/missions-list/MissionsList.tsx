import * as React from 'react';
import { connect } from 'react-redux';
import withShowByProps from 'components/compositions/vokinda-hoc/show-by-props/withShowByProps';
import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { makeUnixTime, secondsToTime, getFormattedDateTime } from 'utils/dates';
import { Glyphicon } from 'react-bootstrap';
import { NO_DATA_TEXT } from 'constants/statuses';

type PropsCarMissions = {
  showMissionInfoForm: Function;
  showMissionForm: Function;
  
  missions: any[],
  parkings: any[],
};

class MissionsList extends React.Component<PropsCarMissions, {}> {
  showMissionInfoForm: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionInfoForm(Number(id))
  )
  setMissionById: any = ({ currentTarget: { dataset: { id } } }) => (
    this.props.showMissionForm(Number(id))
  )

  render() {

    const { missions: { length }, missions, parkings } = this.props;

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
          missions.map(mission => {
            const missionStart = makeUnixTime(mission.date_start);
            const missionEnd = makeUnixTime(mission.date_end);
            const parkingTime = parkings.map(({ start_point, end_point }) => {
              const start = Math.max(start_point.timestamp, missionStart);
              const end = Math.min(end_point.timestamp, missionEnd);

              if (end < start) {
                return 0;
              }
              return end - start;
            }).reduce((a, b) => a + b, 0);

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
                  <div className={'mission_vehicle_info'}>{`Время стоянок: ${secondsToTime(parkingTime)}`}</div>
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
            )
          })
        )
      }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  missions: state.monitorPage.carInfo.missionsData.missions,
  parkings: state.monitorPage.carInfo.trackCaching.parkings,
});

export default hocAll(
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'missionsData', 'missions'],
    type: 'loader-field',
  }),
  withShowByProps({
    path: ['monitorPage', 'carInfo', 'trackCaching', 'parkings'],
    type: 'loader-field',
  }),
  connect(
    mapStateToProps,
  )
)(MissionsList)
