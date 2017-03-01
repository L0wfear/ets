import React, { Component, PropTypes } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import groupBy from 'lodash/groupBy';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import Panel from 'components/ui/Panel.jsx';
import { sensorsMapOptions } from 'constants/sensors.js';
import { makeDate, makeTime } from 'utils/dates';
import LineChart from './LineChart';


export default class Charts extends Component {

  static propTypes = {
    car: PropTypes.object,
  }

  state = {
    chartTab: 0,
    rawData: false,
  }

  showOnMap(timestamp, e, event) {
    const threshold = e && e.point.series.closestPointRange ? e.point.series.closestPointRange : 0;
    const points = this.props.car.marker.track.points.filter(p => (timestamp >= p.timestamp - threshold) && (timestamp <= p.timestamp + threshold));
    const point = points.length === 1 ? points[0] : points.reduce((prev, curr) => (Math.abs(curr.speed_avg - e.point.y) < Math.abs(prev.speed_avg - e.point.y) ? curr : prev));
    const extent = [point.coords_msk[0], point.coords_msk[1], point.coords_msk[0], point.coords_msk[1]];
    const map = this.props.car.marker.map;
    const track = this.props.car.marker.track;
    setTimeout(() => map.getView().fit(extent, map.getSize(), { padding: [50, 550, 50, 50], maxZoom: 13 }), 100);
    map.get('parent').handleFeatureClick(track, point, event);
  }

  renderEventTable(data) {
    const rows = data.map((d, i) => (
      <tr key={i} onClick={() => this.showOnMap(d.start_point.timestamp, null, true, d)}>
        <td>{d.date}</td>
        <td>{d.type_name}</td>
        <td>{d.value}</td>
      </tr>
    ));
    return (
      <table className="car-info-event-table">
        <thead>
          <tr>
            <td>Дата и время</td>
            <td>Событие</td>
            <td>Уровень</td>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }

  renderSpeedChart() {
    const { points } = this.props.car.marker.track;
    if (!points) return 'Загрузка...';
    if (!points.length) return 'Нет данных';
    const timestamps = points.map(p => p.timestamp);
    const sensorsData = [];
    let sensorsList = points.filter(p => p.sensors && p.sensors.equipment).map((p) => {
      p.sensors.equipment.forEach((s) => { s.timestamp = p.timestamp; });
      return p.sensors.equipment;
    });
    sensorsList = groupBy(flatten(sensorsList), s => s.id);
    Object.keys(sensorsList).forEach((id, i) => {
      const sensorOptions = sensorsMapOptions(i, this.props.car.marker.track.maxSpeed);
      const values = sensorsList[id].map(s => [s.timestamp, s.val ? sensorOptions.value : 0]);
      sensorsData.push({
        name: `Датчик №${i + 1}`,
        enableMouseTracking: false,
        connectNulls: false,
        color: sensorOptions.color,
        data: timestamps.map((t) => {
          const s = values.find(v => v[0] === t);
          if (s && s[1]) {
            return s[1];
          }
          return null;
        }),
      });
    });
    const data = [
      {
        name: 'Скорость ТС',
        data: points.map(p => parseInt(p.speed_avg, 10)),
        color: 'rgba(90, 242, 18, 1)',
      },
      {
        name: 'Максимальная скорость',
        data: points.map(() => parseInt(this.props.car.marker.track.maxSpeed, 10)),
        color: 'rgba(205, 17, 71, 1)',
      },
    ].concat(sensorsData).map((d) => {
      d.data = d.data.map((v, i) => [timestamps[i], v]);
      return d;
    });
    return <LineChart name="speedChart" data={data} showX onClick={e => this.showOnMap(e.point.x, e)} />;
  }

  renderFuelChart() {
    const { points, events } = this.props.car.marker.track;
    const { rawData } = this.state;
    if (!points) return 'Загрузка...';
    if (!points.length) return 'Нет данных';
    const timestamps = points.filter(p => get(p, 'sensors.level.length', false)).map(p => p.timestamp);
    const sensorsData = [];
    let sensorsList = points.filter(p => p.sensors && p.sensors.level).map((p) => {
      p.sensors.level.forEach((s) => { s.timestamp = p.timestamp; });
      return p.sensors.level;
    });
    sensorsList = groupBy(flatten(sensorsList), s => s.id);
    Object.keys(sensorsList).forEach((id, i) => {
      const color = sensorsMapOptions(i).color;
      const values = sensorsList[id].map(s => [s.timestamp, rawData ? s.raw : s.val]);
      sensorsData.push({
        name: `ДУТ №${i + 1}`,
        connectNulls: false,
        color,
        data: timestamps.map((t) => {
          const s = values.find(v => v[0] === t);
          if (s && s[1]) {
            return s[1];
          }
          return null;
        }),
      });
    });
    const data = sensorsData.map((d) => {
      d.data = d.data.map((v, i) => [timestamps[i], v]);
      return d;
    });

    let sumEvents = [];
    Object.keys(events).forEach((k) => {
      events[k].forEach(e => (e.id = k));
      sumEvents = sumEvents.concat(events[k]);
    });
    sumEvents = sumEvents.map(e => ({
      ...e,
      date: `${makeDate(new Date(e.start_point.timestamp * 1000))} ${makeTime(new Date(e.start_point.timestamp * 1000), true)}`,
      type_name: e.type === 'leak' ? 'Слив' : 'Заправка',
      value: `${Math.abs(e.val)} л`,
    }));
    return (
      <div>
        <LineChart name={rawData ? 'fuelChartRaw' : 'fuelChart'} data={data} showX onClick={e => this.showOnMap(e.point.x, e)} />
        <div className="chart-checkbox" onClick={() => this.setState({ rawData: !rawData })}>
          <input readOnly type="checkbox" checked={rawData} />
          Исходные данные датчиков
        </div>
        {!rawData && this.renderEventTable(sumEvents)}
      </div>
    );
  }

  render() {
    return (
      <div>
        <ButtonGroup className="car-info-chart-menu">
          <Button className={!this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 0 })}>Датчики топлива</Button>
          <Button className={this.state.chartTab && 'active'} onClick={() => this.setState({ chartTab: 1 })}>Датчики скорости</Button>
        </ButtonGroup>
        <Panel>
          {this.state.chartTab ? this.renderSpeedChart() : this.renderFuelChart()}
        </Panel>
      </div>
    );
  }
}
