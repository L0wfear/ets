import { get, keyBy } from 'lodash';

import { ConsumableMaterialCountMissionService } from 'api/Services';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { ConsumableMaterialCountMission } from 'redux-main/reducers/modules/some_uniq/consumable_material_count/@types';

type PayloadMission = {
  type: 'duty_mission' | 'mission';
  norm_id: number;
  municipal_facility_id: number;
  date: string;
  route_id: number;
  order_operation_id?: number;
  passes_count?: number;
  mission_id?: number;
};

export const promiseLoadConsumableMaterialCountMission = async ({ type, ...payload }: PayloadMission) => {
  let response = null;

  try {
    response = await ConsumableMaterialCountMissionService.path(type).get({
      ...payload,
      date: createValidDate(payload.date),
    });
  } catch (error) {
    console.error(error); // tslint:disable-line
  }

  const result: Array<ConsumableMaterialCountMission> = get(response, 'result.rows', []);

  return {
    data: result,
    dataIndex: keyBy(result, 'consumable_material_id'),
  };
};
