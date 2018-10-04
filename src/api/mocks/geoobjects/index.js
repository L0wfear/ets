import SSPMock from './ssp';
import FuelingWaterMock from './fueling_water';
import CarPoolMock from './carpool';
import DangerZoneMock from './danger_zone';

export default {
  ssp: new SSPMock(),
  fueling_water: new FuelingWaterMock(),
  carpool: new CarPoolMock(),
  danger_zone: new DangerZoneMock(),
};
