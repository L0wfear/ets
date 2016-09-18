import geoobjects from './geoobjects';
import reports from './reports';
import MissionDataMock from './mission_data.js';
import OrganizationsMock from './organizations.js';
import ODHNormMock from './odh_norm.js';
import ODHNormDataSummerMock from './odh_norm_data_summer.js';
import EfficiencyMock from './efficiency.js';

export const mocks = Object.assign({},
  reports,
  geoobjects,
  {
    mission_data: new MissionDataMock(),
    organizations: new OrganizationsMock(),
    odh_norm: new ODHNormMock(),
    odh_norm_data_summer: new ODHNormDataSummerMock(),
    efficiency: new EfficiencyMock(),
  }
);
