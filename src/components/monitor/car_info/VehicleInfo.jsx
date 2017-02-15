import React, { Component, PropTypes } from 'react';
import Panel from 'components/ui/Panel.jsx';
import { makeUnixTime, secondsToTime } from 'utils/dates';
import MissionFormWrap from '../../missions/mission/MissionFormWrap.jsx';
import VehicleAttributes from './VehicleAttributes.jsx';


export default class VehicleInfo extends Component {

  static propTypes = {
    car: PropTypes.object,
    flux: PropTypes.object,
    from_dt: PropTypes.instanceOf(Date),
    to_dt: PropTypes.instanceOf(Date),
  }

  state = {
    missions: [],
    selectedMission: null,
    showMissionForm: false,
  }

  async componentWillMount() {
    const { flux, car, from_dt, to_dt } = this.props;
    if (car) {
      const carsList = flux.getStore('objects').state.carsList;
      const selectedCar = carsList.find(c => c.gov_number === car.car.gov_number);
      if (selectedCar) {
        const car_id = selectedCar.asuods_id;
        const missions = await flux.getActions('cars').getCarMissions(car_id, from_dt, to_dt);
        this.setState({ missions: missions.result, car: selectedCar });
      }
    }
  }

  async componentWillReceiveProps(props) {
    const { flux, car, from_dt, to_dt } = this.props;
    if (props.car.id !== car.id) {
      const carsList = flux.getStore('objects').state.carsList;
      const selectedCar = carsList.find(c => c.gov_number === props.car.car.gov_number);
      if (selectedCar) {
        const car_id = selectedCar.asuods_id;
        const missions = await flux.getActions('cars').getCarMissions(car_id, from_dt, to_dt);
        this.setState({ missions: missions.result, car: selectedCar });
      }
    }
  }

  async setMissionById(id) {
    const response = await this.props.flux.getActions('missions').getMissionById(id);
    this.setState({ selectedMission: response.result.rows[0], showMissionForm: true });
  }

  render() {
    const { missions = [] } = this.state;
    const { car } = this.props;
    const { marker } = car;
    const { parkings = [] } = this.props.car.marker.track;
    let missionsRender = (
      <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {missions.map((mission) => {
          const missionStart = makeUnixTime(mission.date_start);
          const missionEnd = makeUnixTime(mission.date_end);
          const parkingTime = parkings.length ? parkings.map((p) => {
            const start = p.start_point.timestamp > missionStart ? p.start_point.timestamp : missionStart;
            const end = p.end_point.timestamp < missionEnd ? p.end_point.timestamp : missionEnd;
            if (end < start) return 0;
            return end - start;
          }).reduce((a, b) => a + b) : 0;
          return (
            <div key={mission.id}>
              <span
                onClick={() => this.setMissionById(mission.id)}
                style={{ whiteSpace: 'nowrap', display: 'block', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {`№${mission.number} - ${mission.technical_operation_name}`}
              </span>
              <span style={{ color: '#666' }}>{`Время стоянок: ${secondsToTime(parkingTime)}`}</span>
            </div>
          );
        })}
      </div>
    );

    if (!missions.length) missionsRender = 'Нет данных';
    return (
      <div className="car-info-tracking">
        <Panel>
          <VehicleAttributes point={car} car={this.state.car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()} />
        </Panel>
        <Panel title="Задания" className="chart-datepickers-wrap">
          {missionsRender}
        </Panel>
        <MissionFormWrap
          onFormHide={() => this.setState({ showMissionForm: false })}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
        />
      </div>
    );
  }
}
