import { CleaningOneNormService } from 'api/Services';
import { get } from 'lodash';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

export const getValidOneNormPayload = (outerData) => {
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

  return payload;
};

export const promiseGetCleaningOneNorm = async (payload) => {
  let response = null;

  try {
    response = await CleaningOneNormService.get(payload);
  } catch (error) {
    console.warn(error); //tslint:disable-line
    response = null;
  }

  const data: Norm = get(response, 'result.rows.0', null);

  return data;
};
