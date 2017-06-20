import { Store } from 'flummox';
import _ from 'lodash';
import { getToday9am, getTomorrow9am } from 'utils/dates';

class MissionsStore extends Store {

  constructor(flux) {
    super();

    const missionsActons = flux.getActions('missions');
    this.register(missionsActons.getMissions, this.handleGetMissions);
    this.register(missionsActons.getMissionsByCarAndDates, this.handleGetMissions);
    this.register(missionsActons.createMission, this.handleGetMissions);
    this.register(missionsActons.updateMission, this.handleGetMissions);
    this.register(missionsActons.removeMission, this.handleGetMissions);
    this.register(missionsActons.getMissionSources, this.handleGetMissionSources);
    this.register(missionsActons.getMissionTemplates, this.handleGetMissionTemplates);
    this.register(missionsActons.createMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.removeMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.updateMissionTemplate, this.handleGetMissionTemplates);
    this.register(missionsActons.getMissionReports, this.handleGetMissionReports);
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
      selectedReportData: [],
      selectedReportDataODHS: [],
      dutyMissionsList: [],
      dutyMissionTemplatesList: [],
    };
  }

  handleGetMissions(missions) {
    if (!missions.result.meta) return;
    this.setState({ missionsList: missions.result.rows, totalCount: missions.result.meta.total_count });
  }

  handleGetMissionSources(missionSources) {
    this.setState({ missionSourcesList: missionSources.result });
  }

  handleGetMissionTemplates(missionTemplate) {
    this.setState({ missionTemplatesList: missionTemplate.result });
  }

  handleGetDutyMissions(dutyMissions) {
    if (!dutyMissions.result.meta) return;
    this.setState({ dutyMissionsList: dutyMissions.result.rows, totalCount: dutyMissions.result.meta.total_count });
  }

  handleGetDutyMissionTemplates(dutyMissionTemplates) {
    this.setState({ dutyMissionTemplatesList: dutyMissionTemplates.result });
  }

  getMissionSourceById(id) {
    return _.find(this.state.missionSourcesList, ms => ms.id === id) || {};
  }

  handleGetMissionReports(data) {
    // let selectedReportData = data.result[0].result.result.map((r,i) => {
    //   r.index = i;
    //   return r;
    // });
    const selectedReportData = data.result.rows.map((r, i) => {
      r.index = i;
      return r;
    });
    this.setState({ selectedReportData });
  }

  handleGetMissionReportByODHs(index) {
    // TODO убрать добавку route_check_unit
    const missionReport = this.state.selectedReportData[index];
    const selectedReportDataODHS = missionReport.report_by_obj;
    _.each(selectedReportDataODHS, r => (r.route_check_unit = missionReport.route_check_unit));
    this.setState({ selectedReportDataODHS });
  }

  handleGetMissionReportByPoints(index) {
    const missionReport = this.state.selectedReportData[index];
    const selectedReportDataPoints = missionReport.report_by_point;
    this.setState({ selectedReportDataPoints });
  }

  handleGetMissionReportByDTs(index) {
    // TODO убрать добавку route_check_unit
    const missionReport = this.state.selectedReportData[index];
    const selectedReportDataDTS = missionReport.report_by_dt;
    _.each(selectedReportDataDTS, r => (r.route_check_unit = missionReport.route_check_unit));
    this.setState({ selectedReportDataDTS });
  }

}

export default MissionsStore;

export function getDefaultMission(date_start = getToday9am(), date_end = getTomorrow9am()) {
  return {
    description: '',
    date_start,
    date_end,
    assign_to_waybill: 'assign_to_new_draft',
    mission_source_id: 3,
    passes_count: 1,
  };
}

export function getDefaultDutyMission() {
  return {
    status: 'not_assigned',
    plan_date_start: getToday9am(),
    plan_date_end: getTomorrow9am(),
    fact_date_start: null,
    fact_date_end: null,
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
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    mission_source_id: 4,
  };
}

export function getDefaultMissionTemplate() {
  return {
    description: '',
    passes_count: 1,
  };
}

export function getDefaultMissionsCreationTemplate() {
  return {
    date_start: getToday9am(),
    date_end: getTomorrow9am(),
    assign_to_waybill: 'assign_to_new_draft',
    mission_source_id: 4,
    passes_count: 1,
  };
}
