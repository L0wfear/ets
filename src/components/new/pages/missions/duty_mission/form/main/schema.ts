import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { PropsDutyMissionForm } from './@types/index.h';
import { isPermittedEmployeeForDutyMission } from './utils';
import { diffDates } from 'utils/dates';
import { get } from 'lodash';
import { routeTypesByTitle } from 'constants/route';

export const dutyDutyMissionFormSchema: SchemaType<DutyMission, PropsDutyMissionForm> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    fact_date_start: {
      title: 'Фактическая дата начала',
      type: 'datetime',
      required: false,
      dependencies: [
        (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = diffDates(value, plan_date_start) < 0
                                || diffDates(value, plan_date_end) > 0;

          if (value && pbs && validInterval) {
            return 'Фактическая дата начала не должна выходить за границы плановых дат';
          }
          return '';
        },
        (value, { fact_date_end }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = diffDates(value, fact_date_end) <= 0;

          if (value && pbs && validInterval) {
            return 'Фактическая дата начала не должна быть позже фактичекой даты окончания';
          }
          return '';
        },
      ],
    },
    fact_date_end: {
      title: 'Фактическая дата окнчания',
      type: 'datetime',
      required: false,
      dependencies: [
        (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = (
            diffDates(value, plan_date_start) < 0
            || diffDates(value, plan_date_end) > 0
          );

          if (value && pbs && validInterval) {
            return 'Фактическая дата окончания не должна выходить за границы плановых дат';
          }
          return '';
        },
      ],
    },
    plan_date_start: {
      title: 'Плановая дата начала',
      type: 'datetime',
      required: true,
      dependencies: [
        (value, { plan_date_end, status }, { dependeceOrder, dependeceTechnicalOperation }) => {
          if (value) {
            if (plan_date_end && diffDates(value, plan_date_end) >= 0) {
              return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
            }

            if (dependeceOrder && dependeceTechnicalOperation) {
              const order_operation_date_from = get(
                dependeceTechnicalOperation,
                'date_from',
                null,
              );
              const order_operation_date_to = get(
                dependeceTechnicalOperation,
                'date_to',
                null,
              );

              const order_date = get(
                dependeceOrder,
                'order_date',
                null,
              );
              const order_date_to = get(
                dependeceOrder,
                'order_date_to',
                null,
              );

              const checkDateFrom = order_operation_date_from || order_date;
              const checkDateTo = order_operation_date_to || order_date_to;
              if (diffDates(value, checkDateFrom) < 0 || diffDates(value, checkDateTo) > 0) {
                return 'Дата не должна выходить за пределы действия поручения (факсограммы)';
              }
            }
          }
          return '';
        },
      ],
    },
    plan_date_end: {
      title: 'Плановая дата окончания',
      type: 'datetime',
      required: true,
      dependencies: [
        (value, { plan_date_start, object_type_name, is_cleaning_norm, status }, { dependeceOrder, dependeceTechnicalOperation }) => {
          if (value) {
            if (dependeceOrder && dependeceTechnicalOperation) {
              const order_operation_date_from = get(
                dependeceTechnicalOperation,
                'date_from',
                null,
              );
              const order_operation_date_to = get(
                dependeceTechnicalOperation,
                'date_to',
                null,
              );

              const order_date = get(
                dependeceOrder,
                'order_date',
                null,
              );
              const order_date_to = get(
                dependeceOrder,
                'order_date_to',
                null,
              );

              const checkDateFrom = order_operation_date_from || order_date;
              const checkDateTo = order_operation_date_to || order_date_to;

              if (diffDates(value, checkDateTo) > 0 || diffDates(value, checkDateFrom) < 0) {
                return 'Дата не должна выходить за пределы действия поручения (факсограммы)';
              }
            }

            if (is_cleaning_norm && plan_date_start && object_type_name) {
              const time = get(routeTypesByTitle, `${object_type_name}.time`, null);

              if (time && diffDates(value, plan_date_start, 'hours') > time && status === 'not_assigned') {
                return `Время выполнения задания для ${object_type_name} должно составлять не более ${time} часов`;
              }
            }
          }
          return '';
        },
      ],
    },
    mission_source_id: {
      title: 'Источник получения задания',
      type: 'valueOfArray',
      required: true,
    },
    route_id: {
      title: 'Маршрут',
      type: 'valueOfArray',
      required: true,
    },
    foreman_id: {
      title: 'Бригадир',
      type: 'valueOfArray',
      required: true,
      dependencies: [
        (value, { structure_id }, { employeeIndex }) => {
          if (value && Object.keys(employeeIndex).length) {
            const isPermitted = isPermittedEmployeeForDutyMission(
              employeeIndex[value],
              structure_id,
            );

            if (!isPermitted) {
              return 'Поле "Бригадир" должно быть заполнено активным сотрудником';
            }
          }

          return '';
        },
      ],
    },
    brigade_employee_id_list: {
      title: 'Бригада',
      type: 'multiValueOfArray',
      required: false,
    },
    municipal_facility_id: {
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
    brigade_employee_id_list_id: {
      type: 'multiValueOfArray',
      title: 'Бригада.ID',
      dependencies: [
        (value, { structure_id }, { employeeIndex }) => {
          if (value.length && Object.keys(employeeIndex).length) {
            const isPermitted = !value.some((employee_id) => (
              !isPermittedEmployeeForDutyMission(
                employeeIndex[employee_id],
                structure_id,
              )
            ));

            if (!isPermitted) {
              return 'Поле "Бригада" должно быть заполнено активными сотрудниками';
            }
          }

          return '';
        },
      ],
    },
  },
};
