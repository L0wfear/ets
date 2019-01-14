import {
  employeeLoadPosition,
} from 'redux-main/reducers/modules/employee/promises';
import { keyBy } from 'lodash';

export const getPosition = employeeLoadPosition;

export const getSetPosition = async (...payload) => {
  const { data } = await getPosition(...payload);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};
