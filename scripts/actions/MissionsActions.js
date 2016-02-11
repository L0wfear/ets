import { Actions } from 'flummox';
import { getMissions,
         getMissionSources,
         createMission,
         removeMission,
         updateMission,
         getMissionTemplates,
         createMissionTemplate,
         removeMissionTemplate,
         updateMissionTemplate,
         getMissionReports,
         getMissionReportById,
         createMissionReport } from '../adapter.js';
import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';
import { isEmpty, isNotNull } from '../utils/functions.js';

export default class MissionsActions extends Actions {

  getMissions(car_id, date_from, date_to, status) {
    const payload = {

    };
    if (!isEmpty(car_id)) {
      payload.car_id = car_id;
    }

    if (!isEmpty(date_to)) {
      payload.date_to = date_to;
    }

    if (!isEmpty(date_from)) {
      payload.date_from = date_from;
    }

    if (!isEmpty(status)) {
      payload.status = status;
    }

    console.error(payload);

    return getMissions(payload);
  }

  getMissionSources() {
    return getMissionSources();
  }

  createMission(mission) {
    const payload = _.clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return createMission(payload);
  }

  removeMission(id) {
    const payload = { id };
    return removeMission(payload);
  }

  updateMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    delete payload.number;
    return updateMission(payload);
  }

  getMissionTemplates() {
    return getMissionTemplates();
  }

  createMissionTemplate(missionTemplate) {
    const payload = _.clone(missionTemplate);
    return createMissionTemplate(payload);
  }

  removeMissionTemplate(id) {
    const payload = { id };
    return removeMissionTemplate(payload);
  }

  updateMissionTemplate(missionTemplate) {
    const payload = _.cloneDeep(missionTemplate);
    delete payload.number;
    delete payload.company_id;
    return updateMissionTemplate(payload);
  }

  getMissionReports() {
    return getMissionReports();
  }

  getMissionReportById(id) {
    const payload = { id };
    return getMissionReportById(payload);
  }

  createMissionReport(payload = {}) {
    return createMissionReport(payload);
  }

  getMissionReportByODHs(data) {
    return data;
  }

}
