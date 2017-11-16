import React from 'react';
import { groupBy, flatten, get, isEqual } from 'lodash';
import { shouldUpdate } from 'recompose';

import { LOAD_PROCESS_TEXT, NO_DATA_TEXT } from 'constants/statuses';
import { hasTrackPointsChanged } from 'utils/geo';
import { sensorsMapOptions } from 'constants/sensors.js';
import LineChart from './LineChart';

const SpeedChartSFC = props => {
  const sensors = get(props, ['car', 'marker', 'track', 'sensors'], null);
  const points = props.trackPoints;

  if (!points || sensors === null) return <span>{LOAD_PROCESS_TEXT}</span>;
  if (!points.length) return <span>{NO_DATA_TEXT}</span>;

  const timestamps = points.map(p => p.timestamp);
  const sensorsData = [];
  let sensorsList = points.filter(p => p.sensors && p.sensors.equipment).map((p) => {
    p.sensors.equipment.forEach((s) => { s.timestamp = p.timestamp; });
    return p.sensors.equipment;
  });
  sensorsList = groupBy(flatten(sensorsList), s => s.id);

  Object.keys(sensorsList).forEach((id, i) => {
    const sensorOptions = sensorsMapOptions(i, props.car.marker.track.maxSpeed);
    const values = sensorsList[id].map(s => [s.timestamp, s.val ? sensorOptions.value : 0]);
    const sensorName = get(sensors, [id, 'type_name']);

    sensorsData.push({
      name: `Датчик №${i + 1} - ${sensorName || LOAD_PROCESS_TEXT}`,
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
      data: points.map(() => parseInt(props.car.marker.track.maxSpeed, 10)),
      color: 'rgba(205, 17, 71, 1)',
    },
  ].concat(sensorsData).map((d) => {
    d.data = d.data.map((v, i) => [timestamps[i], v]);
    return d;
  });
  console.log(data)
  return (
    <LineChart
      name="speedChart"
      data={data}
      showX
      onClick={props.onMapClick}
      forceUpdate={props.hasTrackChanged}
    />
  );
};

export default shouldUpdate(
  (props, nextProps) => {
    const sensors = Object.keys(get(props, 'car.marker.track.sensors', {}));
    const nextSensors = Object.keys(get(nextProps, 'car.marker.track.sensors', {}));
    const hasSensorsChanged = !isEqual(sensors, nextSensors);

    return hasTrackPointsChanged(props.trackPoints, nextProps.trackPoints) || hasSensorsChanged;
  }
)(SpeedChartSFC);
