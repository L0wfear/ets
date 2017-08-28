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
      <td>{Math.abs(d.event_val)}</td>
    </tr>
  ));

  return (
    <table className="car-info-event-table">
      <thead>
        <tr>
          <td>Дата и время</td>
          <td>Событие</td>
          <td>Объем, л</td>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
};

const FuelChartSFC = props => {
  const events = get(props, ['car', 'marker', 'track', 'events'], null);
  const points = props.trackPoints;
  const { rawData } = props;

  if (!points || events === null) return <span>{LOAD_PROCESS_TEXT}</span>;
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
      data: timestamps.reduce((arr, t) => {
        const one = values.find(v => v[0] === t);
        if (one) {
          arr.push([...one]);
        }
        return arr;
      }, []),
      values,
    });
  });

  const data = sensorsData;

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
        updateOnly
        data={data}
        showX
        onClick={props.onMapClick}
        forceUpdate={props.hasTrackChanged}
      />
      <div className="chart-checkbox" onClick={props.onSourceDataCheck}>
        <input readOnly type="checkbox" checked={rawData} />
        Исходные данные датчиков
      </div>
      <EventTable data={sumEvents} showOnMap={props.showOnMap} />
    </div>
  );
};

export default shouldUpdate(
  (props, nextProps) =>
    hasTrackPointsChanged(props.trackPoints, nextProps.trackPoints) ||
    !isEqual(props.rawData, nextProps.rawData)
)(FuelChartSFC);
