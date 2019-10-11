import { Actions } from 'flummox';
import { clone } from 'lodash';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';
import { isEmpty } from 'utils/functions';
import { MissionService } from 'api/missions';

export default class MissionsActions extends Actions {
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
}
