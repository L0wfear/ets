import { Actions } from 'flummox';
import { clone, cloneDeep, keys } from 'lodash';
import { MAX_ITEMS_PER_PAGE } from 'constants/ui';
import { createValidDateTime, createValidDate } from 'utils/dates';
import { isEmpty, flattenObject } from 'utils/functions';
import {
  MissionService,
  MissionArchiveService,
  MissionReassignationService,
  MissionSourceService,
  MissionTemplateService,
  MissionTemplateCarService,
  MissionTemplatesForFaxogramm,
  DutyMissionService,
  DutyMissionArchiveService,
  DutyMissionTemplateService,
  MissionPrintService,
  MissionTemplatePrintService,
  DutyMissionPrintService,
  MissionDataService,
  CarDutyMissionService,
  Cleaning,
} from 'api/missions';

import {
  WaybillService,
} from 'api/Services';

export const parseFilterObject = filter => (
  Object.entries(flattenObject(filter)).reduce((newFilter, [key, { value }]) => ({
    ...newFilter,
    [Array.isArray(value) ? `${key}__in` : key]: value,
  }),
  {})
);

// возвращает статусы задания, которые мы будем искать, в зависимости от статуса ПЛ
// если у ПЛ нет статуса, то нужны исключительно неназначенные задания!
const getMissionFilterStatus = waybillStatus => waybillStatus ? undefined : 'not_assigned';
export default class MissionsActions extends Actions {
  /* ---------- MISSION ---------- */

  getMissions(technical_operation_id, limit = MAX_ITEMS_PER_PAGE, offset = 0, sort_by = ['number:desc'], filter = {}, is_archive = false) {
    const filterValues = parseFilterObject(filter);

    const payload = {
      limit,
      offset,
      sort_by,
      filter: JSON.stringify(filterValues),
      is_archive,
    };

    if (!isEmpty(technical_operation_id)) {
      payload.technical_operation_id = technical_operation_id;
    }

    return MissionService.get(payload);
  }

  getMissionReassignationParameters(payload) {
    if (!payload.car_id) return Promise.reject(new Error('empty car_id'));
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

  getMissionsByCarAndDates(car_id, date_from, date_to, waybillStatus, inBetween, waybill_id) {
    const payload = {};

    const status = getMissionFilterStatus(waybillStatus);

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

    if (!isEmpty(inBetween)) {
      payload.waybill_id = waybill_id;
    }

    return WaybillService.path('available_missions').get(payload);
  }

  getMissionById(id) {
    const payload = { id };

    return MissionService.get(payload);
  }

  getMissionSources(payload) {
    return MissionSourceService.get(payload).then(({ result }) => ({
      result,
      order_mission_source_id: result.rows.find(({ auto }) => auto).id,
    }));
  }

  createMission(mission, defaultAssign) {
    const payload = clone(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    payload.hidden = false;

    if (typeof payload.assign_to_waybill === 'undefined') payload.assign_to_waybill = 'not_assign';
    if (!defaultAssign) payload.assign_to_waybill = 'not_assign';

    if (mission.is_column) {
      return MissionService.path('column/').post(
        {
          missions: payload.car_id.map((car_id, index) => ({
            ...payload,
            car_id,
            norm_id: payload.norm_id[index],
            type_id: payload.type_id[index],
            assign_to_waybill: payload.assign_to_waybill[index],
            is_cleaning_norm: payload.is_cleaning_norm[index],
          })),
        },
        false,
        'json',
      );
    }

    return MissionService.post(payload, false, 'json');
  }

  removeMission(id) {
    const payload = { id };
    return MissionService.delete(payload, false, 'json');
  }

  updateMission(mission) {
    const payload = cloneDeep(mission);
    payload.date_start = createValidDateTime(payload.date_start);
    payload.date_end = createValidDateTime(payload.date_end);
    delete payload.number;
    delete payload.car_gov_number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    delete payload.mission_source_name;
    delete payload.waybill_number;

    return MissionService.put(payload, false, 'json');
  }

  changeArchiveMissionStatus(id, is_archive) {
    const payload = {
      is_archive,
    };

    return MissionArchiveService.path(id).put(payload, false, 'json');
  }

  printMission(data) {
    const payload = cloneDeep(data);

    return MissionPrintService.postBlob(payload);
  }

  getMissionData(mission_id) {
    return MissionDataService.path(mission_id).get().then((ans) => {
      const {
        result: {
          report_data: {
            entries,
          },
        },
      } = ans;
      if (entries) {
        ans.result.report_data.entries.forEach((data, i) => { data.customId = i + 1; });
      }
      // todo
      // убрать
      // для гибридной карты
      return ans;
    });
  }


  /* ---------- MISSION TEMPLATES ---------- */


  getMissionTemplates(payload = {}) {
    if (payload.faxogramm_id) {
      return MissionTemplatesForFaxogramm.get(payload);
    }

    return MissionTemplateService.get(payload);
  }
  getMissionTemplatesCars(payload = {}) {
    if (payload.faxogramm_id) {
      return MissionTemplatesForFaxogramm.get(payload);
    }

    return MissionTemplateCarService.get(payload);
  }

  createMissionTemplate(missionTemplate) {
    const payload = clone(missionTemplate);
    payload.created_at = createValidDate(payload.created_at);

    delete payload.company_id;
    delete payload.number;

    return MissionTemplateService.post(payload, null, 'json');
  }

  createMissions(missionTemplates, missionsCreationTemplate) {
    const missionsCreationTemplateCopy = clone(missionsCreationTemplate);
    const date_start = createValidDateTime(missionsCreationTemplateCopy.date_start);
    const date_end = createValidDateTime(missionsCreationTemplateCopy.date_end);
    const queries = keys(missionTemplates).map(key => missionTemplates[key]).map((query) => {
      const payload = clone(query);
      payload.date_start = date_start;
      payload.date_end = date_end;
      payload.mission_source_id = missionsCreationTemplateCopy.mission_source_id;
      payload.assign_to_waybill = missionsCreationTemplateCopy.assign_to_waybill;
      payload.hidden = true;
      if (!isEmpty(missionsCreationTemplateCopy.passes_count)) {
        payload.passes_count = parseInt(missionsCreationTemplateCopy.passes_count, 10);
      }
      if (!isEmpty(missionsCreationTemplateCopy.faxogramm_id)) {
        payload.faxogramm_id = missionsCreationTemplateCopy.faxogramm_id;
      }
      payload.template_id = payload.id;

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
    const payload = cloneDeep(missionTemplate);
    payload.created_at = createValidDate(payload.created_at);

    delete payload.number;
    delete payload.company_id;

    return MissionTemplateService.put(payload, null, 'json');
  }

  printMissionTemplate(data) {
    const payload = cloneDeep(data);

    return MissionTemplatePrintService.postBlob(payload);
  }


  /* ---------- MISSION DUTY ---------- */


  getDutyMissions(limit = MAX_ITEMS_PER_PAGE, offset = 0, sort_by = ['number:desc'], filter = {}, is_archive = false) {
    const filterValues = parseFilterObject(filter);
    const payload = {
      limit,
      offset,
      sort_by,
      filter: JSON.stringify(filterValues),
      is_archive,
    };

    return DutyMissionService.get(payload).then(({ result }) => ({
      result: {
        ...result,
        rows: result.rows.map(({ brigade_employee_id_list = [], ...empl }) => {
          empl.brigade_employee_id_list = brigade_employee_id_list.map(({ employee_id }) => employee_id);

          return empl;
        }),
      },
    }));
  }

  getDutyMissionById(id) {
    const payload = { id };

    return DutyMissionService.get(payload);
  }

  createDutyMission(mission) {
    const payload = cloneDeep(mission);
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);

    return DutyMissionService.post(payload, false, 'json');
  }

  updateDutyMission(mission) {
    const payload = cloneDeep(mission);
    delete payload.number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    delete payload.foreman_fio;
    delete payload.car_mission_name;
    payload.plan_date_start = createValidDateTime(payload.plan_date_start);
    payload.plan_date_end = createValidDateTime(payload.plan_date_end);
    payload.fact_date_start = createValidDateTime(payload.fact_date_start);
    payload.fact_date_end = createValidDateTime(payload.fact_date_end);

    return DutyMissionService.put(payload, false, 'json');
  }

  changeArchiveDutuMissionStatus(id, is_archive) {
    const payload = {
      is_archive,
    };

    return DutyMissionArchiveService.path(id).put(payload, false, 'json');
  }

  removeDutyMission(id) {
    const payload = { id };
    return DutyMissionService.delete(payload, false, 'json');
  }

  printDutyMission(duty_mission_id) {
    const payload = { duty_mission_id };
    return DutyMissionPrintService.getBlob(payload);
  }


  /* ---------- MISSION DUTY TEMPLATES ---------- */

  getCarDutyMissions() {
    return CarDutyMissionService.get();
  }

  getDutyMissionTemplates(data = {}) {
    const payload = {};
    if (data && data.order_id) {
      payload.order_id = data.order_id;
    }

    return DutyMissionTemplateService.get(payload).then(({ result }) => ({
      result: result.map(({ brigade_employee_id_list = [], ...empl }) => {
        empl.brigade_employee_id_list = brigade_employee_id_list.map(({ employee_id }) => employee_id);

        return empl;
      }),
    }));
  }

  createDutyMissionTemplate(mainMissionData) {
    const payload = cloneDeep(mainMissionData);
    payload.created_at = createValidDate(payload.created_at);

    return DutyMissionTemplateService.post(payload, false, 'json');
  }

  updateDutyMissionTemplate(mission) {
    const payload = cloneDeep(mission);
    payload.created_at = createValidDate(payload.created_at);

    delete payload.number;
    delete payload.technical_operation_name;
    delete payload.route_name;
    return DutyMissionTemplateService.put(payload, false, 'json');
  }

  removeDutyMissionTemplate(id) {
    const payload = { id };
    return DutyMissionTemplateService.delete(payload, false, 'json');
  }

  createDutyMissions(dutyMissionTemplates, dutyMissionsCreationTemplate) {
    const dutyMissionsCreationTemplateCopy = clone(dutyMissionsCreationTemplate);
    const date_start = createValidDateTime(dutyMissionsCreationTemplateCopy.date_start);
    const date_end = createValidDateTime(dutyMissionsCreationTemplateCopy.date_end);
    const queries = Object.keys(dutyMissionTemplates).map(key => dutyMissionTemplates[key]).map((query) => {
      const payload = cloneDeep(query);

      payload.status = 'not_assigned';
      payload.plan_date_start = date_start;
      payload.plan_date_end = date_end;
      payload.fact_date_start = date_start;
      payload.fact_date_end = date_end;
      payload.mission_source_id = dutyMissionsCreationTemplateCopy.mission_source_id;

      if (!isEmpty(dutyMissionsCreationTemplateCopy.faxogramm_id)) {
        payload.faxogramm_id = dutyMissionsCreationTemplateCopy.faxogramm_id;
      }
      payload.template_id = payload.id;

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

  getMissionReportByODHs(index) {
    return index;
  }

  getMissionReportByPoints(index) {
    return index;
  }

  getMissionReportByDTs(index) {
    return index;
  }

  getCleaningOneNorm(outerData) {
    const payload = {
      datetime: createValidDateTime(outerData.datetime || new Date()),
      technical_operation_id: outerData.technical_operation_id,
      municipal_facility_id: outerData.municipal_facility_id,
      route_type: outerData.route_type,
      func_type_id: outerData.func_type_id,
      needs_brigade: outerData.needs_brigade,
      kind_task_ids: outerData.kind_task_ids,
    };

    if (payload.needs_brigade) {
      delete payload.func_type_id;
    }
    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }

    return Cleaning.path('one_norm').get(payload, false, 'json')
      .then(({ result: { rows: [normData] } }) => normData);
  }

  getCleaningByType({ type, payload: outerPyload }) {
    const payload = {
      ...outerPyload,
      start_date: createValidDate(outerPyload.start_date),
      end_date: createValidDate(outerPyload.end_date),
    };
    return Cleaning.path(type).get(payload, false, 'json');
  }

  getCleaningByTypeInActiveMission({ type, norm_id, datetime }) {
    return Cleaning.path(`${type}/${norm_id}`).get({ datetime }, false, 'json');
  }

  getCleaningMunicipalFacilityList(outerPyload) {
    const payload = {
      ...outerPyload,
      start_date: createValidDate(outerPyload.start_date),
      end_date: createValidDate(outerPyload.end_date),
    };

    if (!payload.kind_task_ids) {
      delete payload.kind_task_ids;
    }

    return Cleaning.path('municipal_facility')
      .get(payload, false, 'json')
      .then(({ result: { rows } }) => ({
        municipal_facility_list: rows,
      }));
  }

  getCleaningMunicipalFacilityAllList(outerPyload) {
    const payload = {
      start_date: createValidDate(outerPyload.start_date || new Date()),
      end_date: createValidDate(outerPyload.end_date || new Date()),
    };

    return Cleaning.path('municipal_facility').get(payload, false, 'json');
  }
}
