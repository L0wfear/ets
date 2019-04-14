import { Actions } from 'flummox';
import { clone, cloneDeep } from 'lodash';
import { createValidDateTime, createValidDate } from 'utils/dates';
import { isEmpty, flattenObject } from 'utils/functions';
import {
  MissionService,
  MissionArchiveService,
  MissionReassignationService,
  MissionTemplateCarService,
  MissionTemplatePrintService,
  MissionDataService,
  CarDutyMissionService,
  Cleaning,
} from 'api/missions';

import { WaybillService } from 'api/Services';

export const parseFilterObject = (filter) =>
  Object.entries(flattenObject(filter)).reduce(
    (newFilter, [key, { value }]) => ({
      ...newFilter,
      [Array.isArray(value) ? `${key}__in` : key]: value,
    }),
    {},
  );

// возвращает статусы задания, которые мы будем искать, в зависимости от статуса ПЛ
// если у ПЛ нет статуса, то нужны исключительно неназначенные задания!
const getMissionFilterStatus = (waybillStatus) => {
  return waybillStatus ? undefined : 'not_assigned';
};
export default class MissionsActions extends Actions {
  /* ---------- MISSION ---------- */

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

  getMissionsByCarAndDates(
    car_id,
    date_from,
    date_to,
    waybillStatus,
    waybill_id,
  ) {
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

    if (!!waybill_id && !isEmpty(waybill_id)) {
      payload.waybill_id = waybill_id;
    }

    return WaybillService.path('available_missions').get(payload);
  }

  /**
   * рак
   * @todo missionsActions.actionUpdateMission
   */
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

  getMissionData(mission_id) {
    return MissionDataService.path(mission_id)
      .get()
      .then((ans) => {
        const {
          result: {
            report_data: { entries },
          },
        } = ans;
        if (entries) {
          ans.result.report_data.entries.forEach((data, i) => {
            data.customId = i + 1;
          });
        }
        // todo
        // убрать
        // для гибридной карты
        return ans;
      });
  }

  /* ---------- MISSION TEMPLATES ---------- */
  getMissionTemplatesCars(payload = {}) {
    return MissionTemplateCarService.get(payload);
  }

  createMissions(missionTemplates, missionsCreationTemplate) {
    const missionsCreationTemplateCopy = clone(missionsCreationTemplate);
    const date_start = createValidDateTime(
      missionsCreationTemplateCopy.date_start,
    );
    const date_end = createValidDateTime(missionsCreationTemplateCopy.date_end);

    const queries = Object.entries(missionTemplates).map(([id, query]) => {
      if (query.for_column) {
        return MissionService.path('column').post(
          {
            missions: query.car_ids.map((car_id) => {
              const payloadMission = {
                ...query,
                car_id,
                ...missionsCreationTemplateCopy,
                is_column: true,
                date_start,
                date_end,
                norm_id: missionsCreationTemplateCopy.norm_id[id][car_id],
                assign_to_waybill:
                  missionsCreationTemplateCopy.assign_to_waybill[id][car_id],
              };

              delete payloadMission.car_ids;
              delete payloadMission.car_type_ids;
              delete payloadMission.car_type_names;
              delete payloadMission.car_gov_numbers;
              delete payloadMission.car_gov_numbers_text;

              return payloadMission;
            }),
          },
          false,
          'json',
        );
      }

      const payload = clone(query);

      payload.date_start = date_start;
      payload.date_end = date_end;
      [payload.car_id] = query.car_ids;
      payload.mission_source_id
        = missionsCreationTemplateCopy.mission_source_id;
      payload.assign_to_waybill
        = missionsCreationTemplateCopy.assign_to_waybill;
      payload.hidden = true;
      if (!isEmpty(missionsCreationTemplateCopy.passes_count)) {
        payload.passes_count = parseInt(
          missionsCreationTemplateCopy.passes_count,
          10,
        );
      }
      if (!isEmpty(missionsCreationTemplateCopy.faxogramm_id)) {
        payload.faxogramm_id = missionsCreationTemplateCopy.faxogramm_id;
      }
      payload.template_id = payload.id;
      payload.norm_id
        = missionsCreationTemplateCopy.norm_id[id][payload.car_id];

      delete payload.company_id;
      delete payload.id;
      delete payload.car_ids;
      delete payload.car_gov_numbers;
      delete payload.car_type_ids;
      delete payload.car_type_names;
      delete payload.number;

      return MissionService.post(payload, false, 'json');
    });
    return Promise.all(queries);
  }

  printMissionTemplate(data) {
    const payload = cloneDeep(data);

    return MissionTemplatePrintService.postBlob(payload);
  }

  /* ---------- MISSION DUTY TEMPLATES ---------- */

  getCarDutyMissions() {
    return CarDutyMissionService.get();
  }

  /* ---------- MISSION REPORTS ---------- */

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

    return Cleaning.path('one_norm')
      .get(payload, false, 'json')
      .then(
        ({
          result: {
            rows: [normData],
          },
        }) => normData,
      );
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
