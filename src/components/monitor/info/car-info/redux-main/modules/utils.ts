import { swapCoords } from 'utils/geo';
import * as insider from 'point-in-polygon';
import { sensorsMapOptions } from 'constants/sensors';
import { makeDate, makeTime } from 'utils/dates';

import { initialMaxSpeed } from 'components/monitor/info/car-info/redux-main/modules/constatnts';

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


export const getMaxSpeeds = missions => (
  missions.length
  ? (
    missions.reduce((maxSpeeds, mission) => {
      const { speed_limits } = mission
      maxSpeeds.mkad_speed_lim = Math.min(speed_limits.mkad_speed_lim, maxSpeeds.mkad_speed_lim);
      maxSpeeds.speed_lim = Math.min(speed_limits.speed_lim, maxSpeeds.speed_lim);
      return maxSpeeds;
    }, { mkad_speed_lim: missions[0].speed_limits.mkad_speed_lim, speed_lim: missions[0].speed_limits.speed_lim })
  )
  : (
    { mkad_speed_lim: initialMaxSpeed, speed_lim: initialMaxSpeed }
  )
);


export const checkOnMkad = ({ coords_msk }, odh_mkad) => (
  Object.values(odh_mkad).some(({  shape: { coordinates, type } }) => {
    if (type === 'Polygon') {
      return coordinates.some((polygon) => (
        insider(coords_msk, polygon)
      ));
    }

    if (type === 'MultiPolygon') {
      return coordinates.some((mpolygon) => (
        mpolygon.some(polygon => (
          insider(coords_msk, polygon)
        ))
      ));
    }

    return false;
  })
);

export const checkAndModifyTrack = ({ track: track_old, cars_sensors, events, parkings }, odh_mkad) => {
  let isCorssingMKAD = false;
  let indexLevel = 0;
  let indexEquipment = 0;

  const front_cars_sensors_level = Object.entries(cars_sensors as TypeCarsSensors).reduce((newObj, [key, sensor]) => {
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
      }
      indexLevel += 1;
    }

    return newObj;
  }, {});

  const front_cars_sensors_equipment = Object.entries(cars_sensors as TypeCarsSensors).reduce((newObj, [key, sensor]) => {
    if (sensor.type_slug === 'equipment') {
      newObj[key] = {
        name: `ДУТ №${indexEquipment + 1} - ${sensor.type_name || '---'}`,
        connectNulls: false,
        sensor,
        data: [],
        indexEquipment,
        color: sensorsMapOptions(indexEquipment).color,
        show: false,
      }
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
      level.forEach(sensorData => {
        front_cars_sensors_level[sensorData.sensor_id].data.push([point.timestamp, sensorData.val]);
        front_cars_sensors_level[sensorData.sensor_id].raw_data.push([point.timestamp, sensorData.raw]);
      });
    }

    const { sensors: { equipment = [] } = {} } = point;

    const equipmentObj = equipment.reduce((newObj, { sensor_id, ...sensorData }) => ({
      ...newObj,
      [sensor_id]: {
        ...sensorData,
      },
    }), {});

    Object.entries(front_cars_sensors_equipment as TypeFrontCarsSensorsEquipment)
      .forEach(([key, value]) => {
        value.data.push([
          point.timestamp,
          equipmentObj[key] && equipmentObj[key].val || null,
          point.checkCoordsMsk.onMkad
        ])
      })


    return point;
  });

  const front_events_list = Object.values(events)
    .reduce<any[]>((newArr, eventData: any[]) => {
      newArr.push(
        ...eventData.map((event) => {
          const newDate = new Date(event.start_point.timestamp * 1000);
          
          return {
            ...event,
            start_point: {
              ...event.start_point,
              coords: swapCoords(event.start_point.coords),
              coords_msk: swapCoords(event.start_point.coords_msk),
            },
            end_point: {
              ...event.end_point,
              coords: swapCoords(event.end_point.coords),
              coords_msk: swapCoords(event.end_point.coords_msk),
            },
            date: `${makeDate(newDate)} ${makeTime(newDate, true)}`,
            type_name: event.event_type === 'leak' ? 'Слив' : 'Заправка',
            value: `${Math.abs(event.event_val)} л`,
          };
        }),
      )

      return newArr;
    }, [])
    .sort((a, b) => (a.start_point.timestamp - b.start_point.timestamp));

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
  }))
  return {
    track,
    isCorssingMKAD,
    front_cars_sensors_level,
    front_cars_sensors_equipment,
    front_events_list,
    front_parkings,
  };
}