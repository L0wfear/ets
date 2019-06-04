import { swapCoords } from 'utils/geo';
import { get } from 'lodash';
import * as insider from 'point-in-polygon';
import { sensorsMapOptions } from 'constants/sensors';
import { makeDate, makeTime } from 'utils/dates';

type TypeFrontCarsSensorsEquipment = {
  [key: string]: {
    data: any[];
  };
};

type TypeCarsSensors = {
  [key: string]: {
    type_slug: string;
    type_name?: string;
  };
};

export const initialMaxSpeed = 60;

export const getMaxSpeeds = (missions) =>
  missions.reduce(
    (maxSpeeds, mission) => {
      const { speed_limits } = mission;
      maxSpeeds.mkad_speed_lim = Math.max(
        speed_limits.mkad_speed_lim,
        maxSpeeds.mkad_speed_lim,
      );
      maxSpeeds.speed_lim = Math.max(
        speed_limits.speed_lim,
        maxSpeeds.mkad_speed_lim,
      );

      return maxSpeeds;
    },
    { mkad_speed_lim: initialMaxSpeed, speed_lim: initialMaxSpeed },
  );

export const checkOnMkad = ({ coords_msk }, odh_mkad) =>
  Object.values(odh_mkad).some(({ shape: { coordinates, type } }) => {
    if (type === 'Polygon') {
      return coordinates.some((polygon) => insider(coords_msk, polygon));
    }

    if (type === 'MultiPolygon') {
      return coordinates.some((mpolygon) =>
        mpolygon.some((polygon) => insider(coords_msk, polygon)),
      );
    }

    return false;
  });

export const checkAndModifyTrack = (
  { track: track_old, cars_sensors, events, parkings },
  odh_mkad,
) => {
  let isCorssingMKAD = false;
  let indexLevel = 0;
  let indexEquipment = 0;

  const front_cars_sensors_level = Object.entries(
    cars_sensors as TypeCarsSensors,
  ).reduce((newObj, [key, sensor]) => {
    if (sensor.type_slug === 'level') {
      newObj[key] = {
        name: `ДУТ №${indexLevel + 1}`,
        connectNulls: false,
        sensor,
        raw_data: [],
        data: [],
        index: indexLevel,
        color: sensorsMapOptions(indexLevel).color,
        show: false,
      };

      indexLevel += 1;
    }

    return newObj;
  }, {});

  const front_cars_sensors_equipment = Object.entries(
    cars_sensors as TypeCarsSensors,
  ).reduce((newObj, [key, sensor]) => {
    if (sensor.type_slug === 'equipment') {
      newObj[key] = {
        name: `Датчик №${indexEquipment + 1} - ${sensor.type_name || '---'}`,
        connectNulls: false,
        sensor,
        data: [],
        indexEquipment,
        color: sensorsMapOptions(indexEquipment).color,
        show: false,
      };

      indexEquipment += 1;
    }

    return newObj;
  }, {});

  const track = track_old.map(({ ...point }: any) => {
    point.coords = swapCoords(point.coords);
    point.coords_msk = swapCoords(point.coords_msk);
    point.checkCoordsMsk = {
      onMkad: checkOnMkad(point, odh_mkad),
    };

    isCorssingMKAD = isCorssingMKAD || point.checkCoordsMsk.onMkad;

    if (point.sensors && point.sensors.level) {
      const { sensors: { level = [] } = {} } = point;
      level.forEach((sensorData) => {
        if (front_cars_sensors_level[sensorData.sensor_id]) {
          front_cars_sensors_level[sensorData.sensor_id].data.push([
            point.timestamp,
            sensorData.val,
          ]);
          front_cars_sensors_level[sensorData.sensor_id].raw_data.push([
            point.timestamp,
            sensorData.raw,
          ]);
        }
      });
    }

    const { sensors: { equipment = [] } = {} } = point;

    const equipmentObj = equipment.reduce(
      (newObj, { sensor_id, ...sensorData }) => ({
        ...newObj,
        [sensor_id]: {
          ...sensorData,
        },
      }),
      {},
    );

    Object.entries(
      front_cars_sensors_equipment as TypeFrontCarsSensorsEquipment,
    ).forEach(([key, value]) => {
      value.data.push([
        point.timestamp,
        (equipmentObj[key] && equipmentObj[key].val) || null,
        point.checkCoordsMsk.onMkad,
      ]);
    });

    return point;
  });

  const front_events_list = Object.values(events)
    .reduce<any[]>((newArr, eventData: any[]) => {
      const timestampStart = get(eventData, ['start_point', 'timestamp'], null);

      if (timestampStart) {
        newArr.push(
          ...eventData.map((event) => {
            return {
              ...event,
              start_coords: [event.start_lon, event.start_lat],
              start_coords_msk: [event.start_y_msk, event.start_x_msk],
              end_coords: [event.finish_lon, event.finish_lat],
              end_coords_msk: [event.finish_y_msk, event.finish_x_msk],
              date: `${makeDate(event.started_at_msk)} ${makeTime(
                event.started_at_msk,
                true,
              )}`,
              type_name: event.event_type === 'leak' ? 'Слив' : 'Заправка',
              value: `${Math.abs(Number(event.event_val.toFixed(2)))} л`,
            };
          }),
        );
      }

      return newArr;
    }, [])
    .sort((a, b) => a.start_point.timestamp - b.start_point.timestamp);

  const front_parkings = parkings.map((parking) => ({
    ...parking,
    start_point: {
      ...parking.start_point,
      coords: swapCoords(parking.start_point.coords),
      coords_msk: swapCoords(parking.start_point.coords_msk),
    },
    end_point: {
      ...parking.end_point,
      coords: swapCoords(parking.end_point.coords),
      coords_msk: swapCoords(parking.end_point.coords_msk),
    },
  }));

  return {
    track,
    isCorssingMKAD,
    front_cars_sensors_level,
    front_cars_sensors_equipment,
    front_events_list,
    front_parkings,
  };
};

export const mergeTrackCachingWithFrontCalc = (trackCaching, odh_mkad) => ({
  ...trackCaching,
  ...checkAndModifyTrack(trackCaching, odh_mkad),
});
