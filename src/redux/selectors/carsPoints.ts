import { createSelector } from 'reselect';

export const getToolbarFiltersCars = state => state.toolbar.filtersCars;

export const getSelectedCarID = state => state.carsPoints.selectedCarId;
export const getCarsData = state => state.carsPoints.carsData;

export const getStatudSelectedCarId = createSelector(
  getSelectedCarID,
  getCarsData,
  (id, carsData) => id && carsData[id].status,
);

/** CarsMarkersLayer */
export const getCarsList = state => state.bigDataCars.carsList;
export const getAllCarsPointsLastUpdate = state => state.carsPoints.lastUpdateCar;

export const getcarsDict = createSelector(
  getCarsList,
  (carsList = []) => carsList.reduce((newObj, { gps_code, asuods_id }) => {
    newObj[gps_code] = asuods_id;

    return newObj;
  }, {}),
);

export const getFiltredCarsPoint = createSelector(
  getCarsList,
  getCarsData,
  (carsList, carsPoints) => Object.entries(carsPoints).reduce((newObj, [key, value]) => {
      const { car: { gps_code } } = value;

      if (carsList.find(c => c.gps_code === gps_code )) {
        newObj[key] = value;
      }

      return newObj;
    }, {}),
);

export const getLastUpdateCars = createSelector(
  getCarsList,
  getAllCarsPointsLastUpdate,
  (carsList, lastUpdateCar) => lastUpdateCar.filter(gps_code => carsList.some(c => c.gps_code === gps_code)),
);

export const getCarInfo = createSelector(
  getCarsData,
  getSelectedCarID,
  (cars, id) => cars[id],
);
// временно cars[id] && cars[id].car
// понять почему туда попадет пустой select
export const getCarData = createSelector(
  getCarsData,
  getSelectedCarID,
  getCarsList,
  (cars, id, carsList) => cars[id] && cars[id].car && carsList.find(c => c.gps_code === cars[id].car.gps_code),
);
