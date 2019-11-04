import { keyBy, get } from 'lodash';
import { PositionService } from 'api/Services';
import { Position } from 'redux-main/reducers/modules/employee/@types/employee.h';

export const getSetPosition = async (payload: object) => {
  let response = null;

  try {
    response = await PositionService.get({ ...payload });
  } catch {
    //
  }

  const result: Array<Position> = get(response, 'result.rows', []);

  return {
    data: result,
    dataIndex: keyBy(result, 'id'),
  };
};
