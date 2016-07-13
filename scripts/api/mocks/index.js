import geoobjects from './geoobjects';
import MissionDataMock from './mission_data.js';
import OrganizationsMock from './organizations.js';

export const mocks = Object.assign({},
	geoobjects,
	{
		mission_data: new MissionDataMock(),
		organizations: new OrganizationsMock()
	}
);
