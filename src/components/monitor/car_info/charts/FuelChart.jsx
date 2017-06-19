import React from 'react';
import { groupBy, flatten, get, isEqual, toArray } from 'lodash';
import { shouldUpdate } from 'recompose';

import { LOAD_PROCESS_TEXT, NO_DATA_TEXT } from 'constants/statuses';
import { makeDate, makeTime } from 'utils/dates';
import { hasTrackPointsChanged } from 'utils/geo';
import { sensorsMapOptions } from 'constants/sensors.js';
import LineChart from './LineChart';

const EventTable = props => {
  const rows = props.data.map((d, i) => (
    <tr key={i} onClick={() => props.showOnMap(d.start_point.timestamp, null, true, d)}>
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
};

const FuelChartSFC = props => {
  const { events } = props.car.marker.track;
  const points = props.trackPoints;
  const { rawData } = props;

  if (!points) return <span>{LOAD_PROCESS_TEXT}</span>;
  if (!points.length) return <span>{NO_DATA_TEXT}</span>;

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

  const sumEvents = flatten(toArray(events))
    .map(e => ({
      ...e,
      date: `${makeDate(new Date(e.start_point.timestamp * 1000))} ${makeTime(new Date(e.start_point.timestamp * 1000), true)}`,
      type_name: e.type === 'leak' ? 'Слив' : 'Заправка',
      value: `${Math.abs(e.val)} л`,
    }));

  return (
    <div>
      <LineChart
        name={rawData ? 'fuelChartRaw' : 'fuelChart'}
        data={data}
        showX
        onClick={props.onMapClick}
      />
      <div className="chart-checkbox" onClick={props.onSourceDataCheck}>
        <input readOnly type="checkbox" checked={rawData} />
        Исходные данные датчиков
      </div>
      {!rawData && <EventTable data={sumEvents} showOnMap={props.showOnMap} />}
    </div>
  );
};

export default shouldUpdate(
  (props, nextProps) =>
    hasTrackPointsChanged(props.trackPoints, nextProps.trackPoints) ||
    !isEqual(props.rawData, nextProps.rawData)
)(FuelChartSFC);
