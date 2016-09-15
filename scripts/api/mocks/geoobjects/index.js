import SSPMock from './ssp.js';
import FuelingWaterMock from './fueling_water.js';
import CarPoolMock from './carpool.js';
import DangerZoneMock from './danger_zone.js';

export default {
  ssp: new SSPMock(),
  fueling_water: new FuelingWaterMock(),
  carpool: new CarPoolMock(),
  danger_zone: new DangerZoneMock(),
};
