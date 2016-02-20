import { Actions } from 'flummox';
import { createMissions} from '../adapter.js';

import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';
import { isEmpty, isNotNull } from '../utils/functions.js';

import { MissionReportsService, MissionService, MissionSourceService, MissionTemplateService } from '../api/Services.js';

export default class MissionsActions extends Actions {

  getMissions(car_id, date_from, date_to, status) {
    const payload = {};
    
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

    return MissionService.get(payload);
  }

  getMissionSources() {
    return MissionSourceService.get();
  }

  createMission(mission) {
    const payload = _.clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return MissionService.create(payload);
  }

  removeMission(id) {
    const payload = { id };
    return MissionService.delete(payload);
  }

  updateMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    delete payload.number;
    return MissionService.update(payload);
  }

  getMissionTemplates() {
    return MissionTemplateService.get();
  }

  createMissionTemplate(missionTemplate) {
    const payload = _.clone(missionTemplate);
    return MissionTemplateService.create(payload);
  }

  createMissions(missionTemplates, missionsCreationTemplate) {
    /*
    const payload = _.clone(missionsCreationTemplate);
     payload.date_start = createValidDateTime(payload.date_start);
     payload.date_end = createValidDateTime(payload.date_end);
     delete payload.date_start;
     delete payload.date_end;
     payload.mission_template_id_list = _.clone(missionTemplatesIds);
     return createMissions(payload);
     */
    const missionsCreationTemplateCopy = _.clone(missionsCreationTemplate);
    const date_start = createValidDateTime(missionsCreationTemplateCopy.date_start);
    const date_end = createValidDateTime(missionsCreationTemplateCopy.date_end);
    const queries = Object.keys(missionTemplates).map((key) => missionTemplates[key]).map((query) => {
      const payload = _.clone(query);
      payload.date_start = date_start;
      payload.date_end = date_end;
      payload.mission_source_id = missionsCreationTemplateCopy.mission_source_id;
      if (!isEmpty(missionsCreationTemplateCopy.passes_count)) {
        payload.passes_count = parseInt(missionsCreationTemplateCopy.passes_count, 10);
      }
      delete payload.company_id;
      delete payload.id;
      delete payload.number;
      return MissionService.create(payload);
    });
    return Promise.all(queries);
  }

  removeMissionTemplate(id) {
    const payload = { id };
    return MissionTemplateService.delete(payload);
  }

  updateMissionTemplate(missionTemplate) {
    const payload = _.cloneDeep(missionTemplate);
    delete payload.number;
    delete payload.company_id;
    return MissionTemplateService.update(payload);
  }

  getMissionReports() {
    return MissionReportsService.get();
  }

  getMissionReportById(id) {
    const payload = { id };
    return MissionReportsService.get(payload);
  }

  createMissionReport(mission_date_start_from, mission_date_end_to) {
    const payload = {
      mission_date_start_from: createValidDateTime(mission_date_start_from),
      mission_date_end_to: createValidDateTime(mission_date_end_to),
    };
    return MissionReportsService.create(payload);
  }

  getMissionReportByODHs(data) {
    return data;
  }

}
