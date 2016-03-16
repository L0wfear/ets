import { Store } from 'flummox';
import _ from 'lodash';
import { getToday9am, getTomorrow9am, getDatesByShift } from '../utils/dates.js';

class MissionsStore extends Store {

  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    this.register(missionsActons.getMissions, this.handleGetMissions);
    this.register(missionsActons.createMission, this.handleGetMissions);
    this.register(missionsActons.updateMission, this.handleGetMissions);
    this.register(missionsActons.removeMission, this.handleGetMissions);
    this.register(missionsActons.getMissionSources, this.handleGetMissionSources);
    this.register(missionsActons.getMissionTemplates, this.handleGetMissionTemplates);
    this.register(missionsActons.createMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.removeMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.updateMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.getMissionReports, this.handleGetMissionReports);
    this.register(missionsActons.createMissionReport, this.handleGetMissionReports);
    this.register(missionsActons.getMissionReportById, this.handleGetMissionReportById);
    this.register(missionsActons.getMissionReportByODHs, this.handleGetMissionReportByODHs);
    this.register(missionsActons.getMissionReportByPoints, this.handleGetMissionReportByPoints);
    this.register(missionsActons.getMissionReportByDTs, this.handleGetMissionReportByDTs);
    this.register(missionsActons.getDutyMissions, this.handleGetDutyMissions);
    this.register(missionsActons.createDutyMission, this.handleGetDutyMissions);
    this.register(missionsActons.updateDutyMission, this.handleGetDutyMissions);
    this.register(missionsActons.removeDutyMission, this.handleGetDutyMissions);
    this.register(missionsActons.getDutyMissionTemplates, this.handleGetDutyMissionTemplates);
    this.register(missionsActons.createDutyMissionTemplate, this.handleGetDutyMissionTemplates);
    this.register(missionsActons.updateDutyMissionTemplate, this.handleGetDutyMissionTemplates);
    this.register(missionsActons.removeDutyMissionTemplate, this.handleGetDutyMissionTemplates);


    this.state = {
      missionsList: [],
      missionSourcesList: [],
      missionTemplatesList: [],
      missionReportsList: [],
      selectedReportData: [],
      selectedReportDataODHS: [],
      dutyMissionsList: [],
      dutyMissionTemplatesList: [],
    };

  }

  handleGetMissions(missions) {
    this.setState({missionsList: missions.result});
	}

  handleGetMissionSources(missionSources) {
    this.setState({missionSourcesList: missionSources.result});
  }

  handleGetMissionTemplates(missionTemplate) {
    this.setState({missionTemplatesList: missionTemplate.result});
  }

  handleGetDutyMissions(dutyMissions) {
    this.setState({dutyMissionsList: dutyMissions.result});
  }

  handleGetDutyMissionTemplates(dutyMissionTemplates) {
    this.setState({dutyMissionTemplatesList: dutyMissionTemplates.result});
  }

  getMissionSourceById(id) {
    return _.find(this.state.missionSourcesList, ms => ms.id === id) || {};
  }

  handleGetMissionReports(missionReports) {
    this.setState({missionReportsList: missionReports.result});
  }

  handleGetMissionReportById(data) {
    let selectedReportData = data.result[0].result.result.map((r,i) => {
      r.index = i;
      return r;
    });
    this.setState({selectedReportData});
  }

  handleGetMissionReportByODHs(index) {
    const missionReport = this.state.selectedReportData;
    this.setState({selectedReportDataODHS: missionReport[index].report_by_odh});
  }

  handleGetMissionReportByPoints(index) {
    const missionReport = this.state.selectedReportData;
    this.setState({selectedReportDataPoints: missionReport[index].report_by_point});
  }

  handleGetMissionReportByDTs(index) {
    const missionReport = this.state.selectedReportData;
    this.setState({selectedReportDataDTS: missionReport[index].report_by_dt});
  }

}

export default MissionsStore;

export function getDefaultMission() {
  return {
    description: "",
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
  };
}

export function getDefaultDutyMission() {
  //let dates = getDatesByShift();
  return {
    status: 'not_assigned',
    plan_date_start: getToday9am(),
    plan_date_end: getTomorrow9am(),
    fact_date_start: getToday9am(),
    fact_date_end: getTomorrow9am(),
    brigade_employee_id_list: [],
    comment: '',
    car_mission_id: 0,
  };
}

export function getDefaultDutyMissionTemplate() {
  return {
  };
}

export function getDefaultDutyMissionsCreationTemplate() {
  return {
  };
}

export function getDefaultMissionTemplate() {
  return {
    description: "",
  };
}

export function getDefaultMissionsCreationTemplate() {
  return {
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    mission_source_id: 4
  };
}
