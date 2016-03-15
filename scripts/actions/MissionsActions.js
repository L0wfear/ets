import { Actions } from 'flummox';
import _ from 'lodash';
import { createValidDateTime } from '../utils/dates.js';
import { isEmpty, isNotNull } from '../utils/functions.js';
import { response } from '../components/missions/DutyMission.js';

import { MissionReportsService, MissionService, MissionSourceService, MissionTemplateService, MissionTemplatesForFaxogramm, MissionLastReportService, DutyMissionService, DutyMissionTemplateService } from '../api/Services.js';

export default class MissionsActions extends Actions {


  /* ---------- MISSION ---------- */

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

  getMissionById(id) {
    const payload = { id };

    return MissionService.get(payload);
  }

  getMissionSources() {
    return MissionSourceService.get();
  }

  createMission(mission) {
    const payload = _.clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    payload.assign_to_waybill = +!!payload.assign_to_waybill;
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




  /* ---------- MISSION TEMPLATES ---------- */




  getMissionTemplates(payload = {}) {
    if (payload.faxogramm_id) {
      return MissionTemplatesForFaxogramm.get(payload);
    }
    return MissionTemplateService.get(payload);
  }

  createMissionTemplate(missionTemplate) {
    const payload = _.clone(missionTemplate);
    return MissionTemplateService.create(payload);
  }

  createMissions(missionTemplates, missionsCreationTemplate) {
    const missionsCreationTemplateCopy = _.clone(missionsCreationTemplate);
    const date_start = createValidDateTime(missionsCreationTemplateCopy.date_start);
    const date_end = createValidDateTime(missionsCreationTemplateCopy.date_end);
    const queries = Object.keys(missionTemplates).map((key) => missionTemplates[key]).map((query) => {
      const payload = _.clone(query);
      payload.date_start = date_start;
      payload.date_end = date_end;
      payload.mission_source_id = missionsCreationTemplateCopy.mission_source_id;
      payload.assign_to_waybill = +!!missionsCreationTemplateCopy.assign_to_waybill;
      if (!isEmpty(missionsCreationTemplateCopy.passes_count)) {
        payload.passes_count = parseInt(missionsCreationTemplateCopy.passes_count, 10);
      }
      if (!isEmpty(missionsCreationTemplateCopy.faxogramm_id)) {
        payload.faxogramm_id = missionsCreationTemplateCopy.faxogramm_id;
      }
      delete payload.company_id;
      delete payload.id;
      delete payload.number;
      return MissionService.create(payload, false);
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




  /* ---------- MISSION DUTY ---------- */




  getDutyMissions() {
    // return new Promise((res, rej) => {
    //   setTimeout(res(response), 500);
    // });
    return DutyMissionService.get({});
  }

  createDutyMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);
    payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(b => b.id);
    console.log(payload);
    return DutyMissionService.create(payload, null, 'json');
  }

  updateDutyMission(mission) {
    const payload = _.cloneDeep(mission);
    delete payload.number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    delete payload.foreman_fio;
    delete payload.mission_name;
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);
    payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(b => b.id);
    return DutyMissionService.update(payload);
  }

  removeDutyMission(id) {
    const payload = { id };
    return DutyMissionService.delete(payload);
  }





  /* ---------- MISSION DUTY TEMPLATES ---------- */





   getDutyMissionTemplates() {
    //  return new Promise((res, rej) => {
    //    setTimeout(res(response), 500);
    //  });
     return DutyMissionTemplateService.get();
   }

   createDutyMissionTemplate(mission) {
     const payload = _.cloneDeep(mission);
     return DutyMissionTemplateService.create(payload);
   }

   updateDutyMissionTemplate(mission) {
     const payload = _.cloneDeep(mission);
     delete payload.number;
     delete payload.technical_operation_name;
     delete payload.route_name;
     return DutyMissionTemplateService.update(payload);
   }

   removeDutyMissionTemplate(id) {
     const payload = { id };
     return DutyMissionTemplateService.delete(payload);
   }





  /* ---------- MISSION REPORTS ---------- */




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

  getMissionReportByODHs(index) {
    return index;
  }

  getMissionReportByPoints(index) {
    return index;
  }

  getMissionReportByDTs(index) {
    return index;
  }

  getMissionLastReport(mission_id) {
    const payload = {
      mission_id
    };
    return MissionLastReportService.get(payload);
  }

}
