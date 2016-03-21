import { Actions } from 'flummox';
import _ from 'lodash';
import { createValidDateTime } from 'utils/dates';
import { isEmpty, isNotNull } from 'utils/functions';
import { MissionReportsService,
         MissionService,
         MissionSourceService,
         MissionTemplateService,
         MissionTemplatesForFaxogramm,
         MissionLastReportService,
         DutyMissionService,
         DutyMissionTemplateService,
         MissionPrintService,
         DutyMissionPrintService } from 'api/Services';

export default class MissionsActions extends Actions {


  /* ---------- MISSION ---------- */

  getMissions(technical_operation_id) {
    const payload = {};

    if (!isEmpty(technical_operation_id)) {
        payload.technical_operation_id = technical_operation_id;
    }

    return MissionService.get(payload);
  }

  getMissionsByCarAndDates(car_id, date_from, date_to, status) {
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
    return MissionService.post(payload);
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
    return MissionService.put(payload);
  }

  printMission(mission_id, image) {
    const payload = {
      mission_id,
      image
    };
    return MissionPrintService.post(payload, (r) => r.blob(), 'json');
  }

  printDutyMission(duty_mission_id) {
    const payload = { duty_mission_id };
    return new Promise((res, rej) => {
      res(DutyMissionPrintService.getUrl());
    });
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
    return MissionTemplateService.post(payload);
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
      return MissionService.post(payload, false);
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
    return MissionTemplateService.put(payload);
  }




  /* ---------- MISSION DUTY ---------- */




  getDutyMissions() {
    return DutyMissionService.get({});
  }

  createDutyMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);
    payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(b => b.id|| b.employee_id);
    console.log(payload);
    return DutyMissionService.post(payload, null, 'json');
  }

  updateDutyMission(mission) {
    const payload = _.cloneDeep(mission);
    delete payload.number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    delete payload.foreman_fio;
    delete payload.car_mission_name;
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);
    payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(b => b.id || b.employee_id);
    return DutyMissionService.put(payload, null, 'json');
  }

  removeDutyMission(id) {
    const payload = { id };
    return DutyMissionService.delete(payload, null, 'json');
  }





  /* ---------- MISSION DUTY TEMPLATES ---------- */





   getDutyMissionTemplates() {
     return DutyMissionTemplateService.get({});
   }

   createDutyMissionTemplate(mission) {
     const payload = _.cloneDeep(mission);
     return DutyMissionTemplateService.post(payload, null, 'json');
   }

   updateDutyMissionTemplate(mission) {
     const payload = _.cloneDeep(mission);
     delete payload.number;
     delete payload.technical_operation_name;
     delete payload.route_name;
     return DutyMissionTemplateService.put(payload, null, 'json');
   }

   removeDutyMissionTemplate(id) {
     const payload = { id };
     return DutyMissionTemplateService.delete(payload, null, 'json');
   }

   createDutyMissions(dutyMissionTemplates, dutyMissionsCreationTemplate) {
     const dutyMissionsCreationTemplateCopy = _.clone(dutyMissionsCreationTemplate);
     const date_start = createValidDateTime(dutyMissionsCreationTemplateCopy.date_start);
     const date_end = createValidDateTime(dutyMissionsCreationTemplateCopy.date_end);
     const queries = Object.keys(dutyMissionTemplates).map((key) => dutyMissionTemplates[key]).map((query) => {
       const payload = _.cloneDeep(query);
       payload.status = 'not_assigned';
       payload.plan_date_start = date_start;
       payload.plan_date_end = date_end;
       payload.fact_date_start = date_start;
       payload.fact_date_end = date_end;
       payload.mission_source_id = dutyMissionsCreationTemplateCopy.mission_source_id;
       payload.brigade_employee_id_list = [];
       payload.foreman_id = 27;
       if (!isEmpty(dutyMissionsCreationTemplateCopy.faxogramm_id)) {
         payload.faxogramm_id = dutyMissionsCreationTemplateCopy.faxogramm_id;
       }
       delete payload.company_id;
       delete payload.id;
       delete payload.number;
       delete payload.technical_operation_name;
       delete payload.route_name;

       return DutyMissionService.post(payload, false, 'json');
     });
     return Promise.all(queries);
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
    return MissionReportsService.post(payload);
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
