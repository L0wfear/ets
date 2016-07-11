// import TimesheetMock from './timesheet.js';
// import SpecialistsMock from './specialists.js';
// import PatientsMock from './patients.js';
import SSPMock from './ssp.js';
import PZVMock from './pzv.js';
import CarPoolMock from './carpool.js';
import DangerZoneMock from './danger_zone.js';


export const mocks = {
	ssp: new SSPMock(),
	pzv: new PZVMock(),
	carpool: new CarPoolMock(),
	danger_zone: new DangerZoneMock()
};
