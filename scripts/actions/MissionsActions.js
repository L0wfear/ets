import { Actions } from 'flummox';
import _ from 'lodash';
import { createValidDateTime } from 'utils/dates';
import { isEmpty } from 'utils/functions';
import { MissionReportsService,
         MissionService,
         MissionReassignationService,
         MissionSourceService,
         MissionTemplateService,
         MissionTemplatesForFaxogramm,
         MissionLastReportService,
         DutyMissionService,
         DutyMissionTemplateService,
         MissionPrintService,
         DutyMissionPrintService,
         MissionDataService } from 'api/Services';
import config from '../config.js';

export default class MissionsActions extends Actions {


  /* ---------- MISSION ---------- */

  getMissions(technical_operation_id) {
    const payload = {};

    if (!isEmpty(technical_operation_id)) {
        payload.technical_operation_id = technical_operation_id;
    }

    return MissionService.get(payload);
  }

  getMissionsByCarAndTimestamp(car_id, timestamp) {
    const payload = {
      car_id,
      point_timestamp: timestamp
    };

    return MissionService.get(payload);
  }

  getMissionReassignationParameters(payload) {
    if (!payload.car_id) return;
    return MissionReassignationService.get(payload);
  }

  createMissionFromReassignation(payload) {
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return MissionReassignationService.post(payload, false, 'json');
  }

  updateMissionFromReassignation(payload) {
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    return MissionReassignationService.put(payload, false, 'json');
  }

  getMissionsByCarAndDates(car_id, date_from, date_to, waybillStatus, inBetween) {
    const payload = {};

    // возвращает статусы задания, которые мы будем искать, в зависимости от статуса ПЛ
    // если у ПЛ нет статуса, то нужны исключительно неназначенные задания!
    let getMissionFilterStatus = (waybillStatus) => !!waybillStatus ? undefined : 'not_assigned';

    let status = getMissionFilterStatus(waybillStatus);

    if (!isEmpty(car_id)) {
      payload.car_id = car_id;
    }

    if (!isEmpty(date_from)) {
      payload.date_from = createValidDateTime(date_from);
    }

    if (!isEmpty(date_to)) {
      payload.date_to = createValidDateTime(date_to);
    }

    if (!isEmpty(status)) {
      payload.status = status;
    }

    if (!isEmpty(inBetween)) {
      payload.in_between = inBetween;
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

  createMission(mission, callback) {
    const payload = _.clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    switch(payload.assign_to_waybill) {
      case 0:
        payload.assign_to_waybill = 'not_assign';
        break;
      case 1:
        payload.assign_to_waybill = 'assign_to_active';
        break;
      case 2:
        payload.assign_to_waybill = 'assign_to_draft';
        break;
    }
    if (!callback) payload.assign_to_waybill = 'not_assign'; //TODO хак, в колбэк попадает !this.props.fromWaybill§
    return MissionService.post(payload, callback, 'json');
  }

  removeMission(id) {
    const payload = { id };
    return MissionService.delete(payload, true, 'json');
  }

  updateMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    delete payload.number;
    delete payload.car_gov_number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    delete payload.mission_source_name;
    delete payload.waybill_number;
    return MissionService.put(payload, true, 'json');
  }

  printMission(data, url) {
    const token = JSON.parse(window.localStorage.getItem('ets-session'));
    let URL = `${config.backend}/plate_mission/`;

    return fetch(URL, {
      method: 'post',
      headers: {
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(data)
    }).then((r) => r.blob());

    // return MissionPrintService.post(payload, (r) => {
    //   return r.blob();
    // }, 'json');
  }

  getMissionData(mission_id) {
    const payload = {
      mission_id
    };

    return MissionDataService.get(payload);
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
    delete payload.company_id;
    delete payload.number;
    return MissionTemplateService.post(payload, null, 'json');
  }

  createMissions(missionTemplates, missionsCreationTemplate) {
    const missionsCreationTemplateCopy = _.clone(missionsCreationTemplate);
    const date_start = createValidDateTime(missionsCreationTemplateCopy.date_start);
    const date_end = createValidDateTime(missionsCreationTemplateCopy.date_end);
    const queries = _.keys(missionTemplates).map((key) => missionTemplates[key]).map((query) => {
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
      return MissionService.post(payload, false, 'json');
    });
    return Promise.all(queries);
  }

  removeMissionTemplate(id) {
    const payload = { id };
    return MissionTemplateService.delete(payload, null, 'json');
  }

  updateMissionTemplate(missionTemplate) {
    const payload = _.cloneDeep(missionTemplate);
    delete payload.number;
    delete payload.company_id;
    return MissionTemplateService.put(payload, null, 'json');
  }




  /* ---------- MISSION DUTY ---------- */




  getDutyMissions() {
    return DutyMissionService.get({});
  }

  getDutyMissionById(id) {
    const payload = { id };

    return DutyMissionService.get(payload);
  }

  createDutyMission(mission) {
    const payload = _.cloneDeep(mission);
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);
    payload.brigade_employee_id_list = payload.brigade_employee_id_list.map(b => b.id|| b.employee_id);
    console.log(payload);
    return DutyMissionService.post(payload, false, 'json');
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

  printDutyMission(duty_mission_id) {
    const payload = { duty_mission_id };
    return DutyMissionPrintService.get(payload, true);
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
    return MissionReportsService.path(id).get();
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
