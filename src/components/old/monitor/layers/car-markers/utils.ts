import * as insider from 'point-in-polygon';
import Feature from 'ol/Feature';
import { geoJSON } from 'utils/ol';
import { add, isNumber, reduce } from 'lodash';
import { WsData } from './LayerCarMarker.h';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const getFrontStatus = (statusId) => {
  switch (statusId) {
    case 1: return {
      slug: 'in_move',
    };
    case 2: return {
      slug: 'stop',
    };
    case 3: return {
      slug: 'parking',
    };
    default: return {
      slug: 'not_in_touch',
    };
  }
};

export const checkOnIncludesCar = (filterData, { garage_number = '', gov_number = '' } = {}) => (
  gov_number && gov_number.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
  || garage_number && garage_number.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
);

export const checkOnIncludesTechCondition = (filterData, { condition = '' } = {}) => (
  condition && condition.toString().toLocaleLowerCase().includes(filterData.toString().toLocaleLowerCase())
);

export const checkOnBuffer = (bufferFeature: any, { coords_msk }) => {

  const newFeature: any = new Feature({
    geometry: geoJSON.readGeometry(bufferFeature),
  });
  const polygonCoordinates = newFeature.getGeometry().getCoordinates();

  return polygonCoordinates.some((polygon) => {
    return insider(coords_msk, polygonCoordinates.length > 1 ? polygon[0] : polygon);
  });
};

export const checkFilterByKey = (key, value, gps_code, wsData, car_actualData, geoobjectsFilter, carsForExclude) => {
  if(geoobjectsFilter !== 'cars') {
    return true;
  }
  switch (key) {
    case 'carFilterText': return !value || checkOnIncludesCar(value, car_actualData); 
    case 'carFilterMultyGpsCode': return !value.length || value.includes(Number(car_actualData.gps_code));
    case 'carFilterMultyType': return !value.length || value.includes(car_actualData.type_id);
    case 'carFilterMultyTechCondition': return !value || checkOnIncludesTechCondition(value, car_actualData);
    case 'carFilterMultyModel': return !value.length || value.includes(car_actualData.model_id);
    case 'carFilterMultyStructure': return !value.length || value.includes(car_actualData.company_structure_id);
    case 'carFilterMultyOkrug': return !value.length || value.includes(car_actualData.okrug_id);
    case 'levelSensors': return value === null || (value === 1 ? car_actualData.level_sensors_num > 0 : car_actualData.level_sensors_num === 0);
    case 'carFilterMultyElement': return true;
    case 'withoutMissions': return !value || !carsForExclude.includes(car_actualData.asuods_id);
    case 'withoutWaybills': return !value || !carsForExclude.includes(car_actualData.asuods_id);
    case 'carFilterMultyDrivers': return !value || value.cars?.includes(car_actualData.asuods_id);
    case 'carFilterMultyOwner': return !value.length || value.includes(car_actualData.owner_id);
    case 'featureBufferPolygon': return !value || checkOnBuffer(value, wsData); // скорее всего, сюда добавить функцию, которая определяет входит ли тачка в буфер
    default: return false;
  }
};

export const checkOnVisible = ({ filters, statusShow, wsData, car_actualData, geoobjectsFilter, carsForExclude}, gps_code: string): boolean => (
  !!car_actualData
  && statusShow[getFrontStatus(wsData.status).slug]
  && !Object.entries(filters).some(([key, value]) => (
    !checkFilterByKey(
      key,
      value,
      gps_code,
      wsData,
      car_actualData,
      geoobjectsFilter,
      carsForExclude
    )
  ))
);

export const calcCountTsByStatus = (carPointsDataWs: WsData, carActualGpsCount: number, carActualList: Array<Car>, filters, geoobjectsFilter, carsForExclude) => {
  const carActualNotInMap = carActualList
    .reduce((carNotInMapList, car) => {
      return Boolean(car.gps_code === null || !carPointsDataWs[car.gps_code])
        ? [...carNotInMapList, car]
        : carNotInMapList;
    }, [])
    .filter((el) => {
      return !Object.entries(filters).some(
        ([key, value]) =>
          !checkFilterByKey(
            key,
            value,
            null,
            {},
            el,
            geoobjectsFilter,
            carsForExclude
          )
      );
    });

  const not_in_map: number = carActualNotInMap.length; // кол-во всех тачек из car_actual, которых не было в данных из сокета

  const countTsByStatus = reduce(
    carPointsDataWs,
    (carsByStatus, carByStatus) => {
      const { front_status, visible } = carByStatus;
      if (visible) {
        return {
          ...carsByStatus,
          [front_status]: add(carsByStatus[front_status], 1),
        };
      } else {
        return carsByStatus;
      }
    },
    { in_move: 0, not_in_touch: 0, parking: 0, stop: 0 },
  );

  if (isNumber(carActualGpsCount)) {
    return {
      ...countTsByStatus,
      not_in_map,
      carActualNotInMap,
    };
  } else {
    return {
      ...countTsByStatus,
      not_in_map,
      carActualNotInMap,
    };
  }
};
