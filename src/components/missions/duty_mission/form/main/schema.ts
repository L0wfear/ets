import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { PropsDutyMissionForm } from './@types/index.h';
import { isPermittedEmployeeForDutyMission } from './utils';
import { diffDates } from 'utils/dates';
import { get } from 'lodash';

export const dutyDutyMissionFormSchema: SchemaType<DutyMission, PropsDutyMissionForm> = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'Фактическая дата начала',
      type: 'datetime',
      required: false,
    },
    {
      key: 'fact_date_end',
      title: 'Фактическая дата окнчания',
      type: 'datetime',
      required: false,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'datetime',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания',
      type: 'datetime',
      required: true,
    },
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'route_id',
      title: 'Маршрут',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'foreman_id',
      title: 'Бригадир',
      type: 'valueOfArray',
      required: true,
    },
    {
      key: 'brigade_employee_id_list',
      title: 'Бригада',
      type: 'multiValueOfArray',
      required: false,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'valueOfArray',
      required: true,
    },
  ],
  dependencies: {
    plan_date_start: [
      (value, { plan_date_end }, { dependeceOrder, dependeceTechnicalOperation }) => {
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
    plan_date_end: [
      (value, _, { dependeceOrder, dependeceTechnicalOperation }) => {
        if (value && dependeceOrder && dependeceTechnicalOperation) {
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
        return '';
      },
    ],
    fact_date_start: [
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
    fact_date_end: [
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
    foreman_id: [
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
    brigade_employee_id_list_id: [
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
};
