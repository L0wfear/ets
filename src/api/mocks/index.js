import geoobjects from './geoobjects';
import reports from './reports';
import MissionDataMock from './mission_data';
import CompaniesMock from './companies';
import ODHNormMock from './odh_norm';

export const mocks = Object.assign({}, reports, geoobjects, {
  mission_data: new MissionDataMock(),
  companies: new CompaniesMock(),
  odh_norm: new ODHNormMock(),
});
