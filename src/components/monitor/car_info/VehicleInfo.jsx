import React, { Component, PropTypes } from 'react';
import { get } from 'lodash';
import { Glyphicon } from 'react-bootstrap';
import MissionInfoFormWrap from 'components/dashboard/MissionInfoForm/MissionInfoFormWrap.jsx';

import Panel from 'components/ui/Panel.jsx';
import { makeUnixTime, secondsToTime } from 'utils/dates';

import MissionFormWrap from '../../missions/mission/MissionFormWrap.jsx';

import VehicleAttributes from './VehicleAttributes.jsx';


export default class VehicleInfo extends Component {

  static propTypes = {
    car: PropTypes.object,
    missions: PropTypes.array,
    flux: PropTypes.object,
    from_dt: PropTypes.instanceOf(Date),
    to_dt: PropTypes.instanceOf(Date),
  }

  state = {
    missions: [],
    selectedMission: null,
    showMissionForm: false,
    missionInfoData: null,
    showMissionInfoForm: false,
  }

  async componentWillMount() {
    const { flux, car, from_dt, to_dt } = this.props;
    if (car) {
      const carsList = flux.getStore('objects').state.carsList;
      const selectedCar = carsList.find(c => c.gov_number === car.car.gov_number);
      if (selectedCar) {
        this.setState({ car: selectedCar });
      }
    }
  }

  async componentWillReceiveProps(props) {
    const { flux, car, from_dt, to_dt } = this.props;
    if (props.car.id !== car.id) {
      const carsList = flux.getStore('objects').state.carsList;
      const selectedCar = carsList.find(c => c.gov_number === props.car.car.gov_number);
      if (selectedCar) {
        this.setState({ car: selectedCar });
      }
    }
  }

  async setMissionById(id) {
    const { result: { rows: [selectedMission] } } = await this.props.flux.getActions('missions').getMissionById(id);
    this.setState({ selectedMission, showMissionForm: true });
  }
  mapView = async (id) => {
    const { result: missionInfoData } = await this.props.flux.getActions('missions').getMissionData(id);
    this.setState({ missionInfoData, showMissionInfoForm: true });
  }

  renderMissionData = (mission) => {
    const { car: { marker = {} } = {} } = this.props;
    const parkings = !!marker.track ? marker.track : [];

    const missionStart = makeUnixTime(mission.date_start);
    const missionEnd = makeUnixTime(mission.date_end);
    const parkingTime = parkings.length ? parkings.map((p) => {
      const start = p.start_point.timestamp > missionStart ? p.start_point.timestamp : missionStart;
      const end = p.end_point.timestamp < missionEnd ? p.end_point.timestamp : missionEnd;
      if (end < start) return 0;
      return end - start;
    }).reduce((a, b) => a + b) : 0;

    return (
      <div key={mission.id} className={'mission-data'}>
        <div>
          <div
            onClick={() => this.setMissionById(mission.id)}
            className={'mission-title'}
          >
            {`№${mission.number} - ${mission.technical_operation_name}`}
          </div>
          <div className={'mission-timestand'}>{`Время стоянок: ${secondsToTime(parkingTime)}`}</div>
        </div>
        <Glyphicon glyph="info-sign" className="pointer fontSize24" onClick={() => this.mapView(mission.id)} />
      </div>
    );
  }

  render() {
    const { car = {}, missions = [] } = this.props;
    const { marker = {} } = car;

    let missionsRender = (
      <div className={'missions-list'}>
        {missions.map(this.renderMissionData)}
      </div>
    );

    if (!missions.length) missionsRender = 'Нет данных';
    const notOkrug = this.props.flux.getStore('session').getCurrentUser().okrug_id === null;
    return (
      <div className="car-info-tracking">
        <Panel>
          <VehicleAttributes isOkrug={!notOkrug} point={car} car={this.state.car} lastPoint={marker.hasTrackLoaded() && marker.track.getLastPoint()} />
        </Panel>
        <Panel title="Задания" className="chart-datepickers-wrap">
          {missionsRender}
        </Panel>
        <MissionFormWrap
          onFormHide={() => this.setState({ showMissionForm: false })}
          showForm={this.state.showMissionForm}
          element={this.state.selectedMission}
        />
        <MissionInfoFormWrap
          onFormHide={() => this.setState({ showMissionInfoForm: false })}
          showForm={this.state.showMissionInfoForm}
          element={this.state.missionInfoData}
          fromMonitor
        />
      </div>
    );
  }
}
