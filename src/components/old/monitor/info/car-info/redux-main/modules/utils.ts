import { swapCoords } from 'utils/geo';
import * as insider from 'point-in-polygon';
import { cloneDeep } from 'lodash';
import { sensorsMapOptions } from 'constants/sensors';
import { makeDate, makeTime } from 'components/@next/@utils/dates/dates';

import { initialMaxSpeed } from 'components/old/monitor/info/car-info/redux-main/modules/constatnts';
import { IStateMonitorPage } from 'components/old/monitor/redux-main/models/monitor-page';
import { async_map } from 'components/@next/@utils/async/async.array';

export const getCarTabInfo = (carInfoData: any) => {
  return {
    contractor_name: carInfoData.contractor_name,
    customer_name: carInfoData.customer_name,
    owner_name: carInfoData.owner_name,
  };
};

export const getMaxSpeeds = (missions) =>
  missions.length
    ? missions.reduce(
      (maxSpeeds, mission) => {
        const { speed_limits } = mission;
        maxSpeeds.mkad_speed_lim = Math.min(
          speed_limits.mkad_speed_lim,
          maxSpeeds.mkad_speed_lim,
        );
        maxSpeeds.speed_lim = Math.min(
          speed_limits.speed_lim,
          maxSpeeds.speed_lim,
        );
        return maxSpeeds;
      },
      {
        mkad_speed_lim: missions[0].speed_limits.mkad_speed_lim,
        speed_lim: missions[0].speed_limits.speed_lim,
      },
    )
    : { mkad_speed_lim: initialMaxSpeed, speed_lim: initialMaxSpeed };

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

export const checkAndModifyTrack = async (
  { track: track_old, cars_sensors, events, parkings },
  odh_mkad,
) => {
  let isCorssingMKAD = false;
  let indexLevel = 0;
  let indexEquipment = 0;

  const front_cars_sensors_level = Object.entries(
    cars_sensors as IStateMonitorPage['carInfo']['trackCaching']['cars_sensors'],
  ).reduce((newObj, [key, sensor]) => {
    if (sensor.type_slug === 'level') {
      (newObj[key] = {
        name: `ДУТ №${indexLevel + 1}`,
        connectNulls: false,
        sensor,
        raw_data: [],
        data: [],
        index: indexLevel,
        color: sensorsMapOptions(indexLevel).color,
        show: false,
      }),
      (indexLevel += 1);
    }

    return newObj;
  }, {});

  const front_cars_sensors_equipment = Object.entries(
    cars_sensors as IStateMonitorPage['carInfo']['trackCaching']['cars_sensors'],
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

  // чтобы не тормозила карта во время обработки
  const track = await async_map(
    track_old,
    (pointOwn) => {
      const point = cloneDeep(pointOwn);
      point.coords = swapCoords(point.coords);
      point.coords_msk = swapCoords(point.coords_msk);
      point.checkCoordsMsk = {
        onMkad: checkOnMkad(point, odh_mkad),
      };

      isCorssingMKAD = isCorssingMKAD || point.checkCoordsMsk.onMkad;

      if (point.sensors && point.sensors.level && Object.values(front_cars_sensors_level).length) {
        const { sensors: { level = [] } = {} } = point;
        level.forEach((sensorData) => {
          try {
            front_cars_sensors_level[sensorData.sensor_id].data.push([
              point.timestamp,
              sensorData.val,
            ]);
            front_cars_sensors_level[sensorData.sensor_id].raw_data.push([
              point.timestamp,
              sensorData.raw,
            ]);
          } catch (e) {
            // tslint:disable-next-line:no-console
            console.error('sensors Error: ', e);
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
        front_cars_sensors_equipment as IStateMonitorPage['carInfo']['trackCaching']['front_cars_sensors_equipment'],
      ).forEach(([key, value]) => {
        value.data.push([
          point.timestamp,
          (equipmentObj[key] && equipmentObj[key].val) || null,
          point.checkCoordsMsk.onMkad,
        ]);
      });

      return point;
    },
  );

  const front_events_list = Object.values(events)
    .reduce<Array<any>>((newArr, eventData: Array<any>) => {
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
