import { get } from 'lodash';
import { Order } from 'redux-main/reducers/modules/order/@types';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { isString } from 'util';

export const isDisabledForCreateMission = (order: Order) => {
  if (order) {
    const status = get(order, 'status');
    const order_date_to = get(order, 'order_date_to');
    const technical_operations = get(order, 'technical_operations') || [];

    return Boolean(
      status === 'suspended'
      || status === 'cancelled'
      || diffDates(new Date(), order_date_to, 'minutes') > 0
      || !technical_operations.some(({ num_exec }) => num_exec > 0),
    );
  }

  return true;
};

export const isDisabledForCreateDutyMission = (order: Order) => {
  if (order) {
    const technical_operations = get(order, 'technical_operations') || [];

    return Boolean(
      isDisabledForCreateMission(order)
      || !technical_operations.some(
        ({ num_exec, work_type_name }) => (
          num_exec > 0
            && (
              (isString(work_type_name) && work_type_name.match(/^Ручн*/))
              || (isString(work_type_name) && work_type_name.match(/^Комбиниров*/))
            )
        ),
      ),
    );
  }

  return true;
};

export const isDisabledForCreateMissionByTO = (order: Order, technical_operation: ValuesOf<Order['technical_operations']>) => {
  if (technical_operation) {
    const status = get(order, 'status');

    const work_type_name = get(technical_operation, 'work_type_name') || [];
    const num_exec = get(technical_operation, 'num_exec') || [];
    const dateTo = get(technical_operation, 'date_to') || get(order, 'date_to');

    return Boolean(
      !num_exec
      || (diffDates(new Date(), dateTo) > 0)
      || status === 'cancelled'
      || status === 'suspended'
      || (isString(work_type_name) && work_type_name.match(/^Ручн*/)),
    );
  }

  return true;
};

export const isDisabledForCreateDutyMissionByTO = (order: Order, technical_operation: ValuesOf<Order['technical_operations']>) => {
  if (technical_operation) {
    const status = get(order, 'status');

    const work_type_name = get(technical_operation, 'work_type_name') || [];
    const num_exec = get(technical_operation, 'num_exec') || [];
    const dateTo = get(technical_operation, 'date_to') || get(order, 'date_to');

    return Boolean(
      status === 'cancelled'
      || status === 'suspended'
      || !(
        (work_type_name === null
          || (isString(work_type_name) && work_type_name.match(/^Ручн*/))
          || work_type_name === 'Комбинированный')
        && num_exec > 0
      )
      || (num_exec <= 0 && status === 'partially_cancelled')
      || diffDates(new Date(), dateTo) > 0,
    );
  }

  return true;
};
