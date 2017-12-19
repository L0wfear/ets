import { diffDates } from 'utils/dates.js';

export const dutyMissionSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'fact_date_start',
      title: 'Технологическая операция',
      type: 'date',
      required: false,
    },
    {
      key: 'fact_date_end',
      title: 'Технологическая операция',
      type: 'date',
      required: false,
    },
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'number',
      required: true,
    },
    {
      key: 'route_id',
      title: 'Маршрут',
      type: 'number',
      required: true,
    },
    {
      key: 'foreman_id',
      title: 'Бригадир',
      type: 'number',
      required: true,
    },
    {
      key: 'brigade_employee_id_list',
      title: 'Бригада',
      type: 'array',
      required: false,
    },
  ],
  dependencies: {
    fact_date_start: [
      {
        validator: (value, { fact_date_end, plan_date_start, plan_date_end }) => {
          const validInterval = diffDates(value, plan_date_start) > 0 &&
                                diffDates(value, plan_date_end) < 0 &&
                                diffDates(fact_date_end, plan_date_start) > 0 &&
                                diffDates(fact_date_end, plan_date_end) < 0;

          if (value && fact_date_end && validInterval && diffDates(value, fact_date_end) >= 0) {
            return 'Время начала не должно быть позже времени окончания работ';
          }
          return undefined;
        },
      },
      {
        validator: (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');

          if (pbs && value && (diffDates(value, plan_date_start) < 0 || diffDates(value, plan_date_end) > 0)) {
            return 'фактическое время начала работ должно входить в интрервал запланируемого времени';
          }
          return undefined;
        },
      },
    ],
    fact_date_end: [
      {
        validator: (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');

          if (pbs && value && (diffDates(value, plan_date_end) > 0 || diffDates(value, plan_date_start) < 0)) {
            return 'фактическое время окончания работ должно входить в интрервал запланируемого времени';
          }
          return undefined;
        },
      },
    ],
  },
};
