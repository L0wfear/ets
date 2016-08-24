import geoobjects from './geoobjects';
import reports from './reports';
import MissionDataMock from './mission_data.js';
import OrganizationsMock from './organizations.js';
import ODHSupportStandardsMock from './odh_support_standards.js'

export const mocks = Object.assign({},
	reports,
	geoobjects,
	{
		mission_data: new MissionDataMock(),
		organizations: new OrganizationsMock(),
		odh_support_standards: new ODHSupportStandardsMock()
	}
);
