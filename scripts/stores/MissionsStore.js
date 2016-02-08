import { Store } from 'flummox';
import _ from 'lodash';
import { getToday9am, getTomorrow9am } from '../utils/dates.js';

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

    this.state = {
      missionsList: [],
      missionSourcesList: [],
      missionTemplatesList: [],
      missionReportsList: [],
      selectedReportData: [],
      selectedReportDataODHS: [],
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
    console.log(selectedReportData)
    this.setState({selectedReportData});
  }

  handleGetMissionReportByODHs(index) {
    const missionReport = this.state.selectedReportData;
    console.log(missionReport);
    this.setState({selectedReportDataODHS: missionReport[index].report_by_odh});
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

export function getDefaultMissionTemplate() {
  return {
    description: "",
  };
}
