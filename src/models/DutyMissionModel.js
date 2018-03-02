import { diffDates } from 'utils/dates.js';

const dutyMissionSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'date',
      required: false,
    },
    {
      key: 'fact_date_start',
      title: 'Фактическая дата начала',
      type: 'date',
      required: false,
    },
    {
      key: 'fact_date_end',
      title: 'Фактическая дата окнчания',
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
      key: 'plan_date_start',
      title: 'Плановая дата начала',
      type: 'date',
      required: true,
    },
    {
      key: 'plan_date_end',
      title: 'Плановая дата окончания',
      type: 'date',
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
    plan_date_start: [
      {
        validator: (value, { plan_date_end }) => {
          if (value && plan_date_end && diffDates(value, plan_date_end) >= 0) {
            return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
          }
          return '';
        },
      },
    ],
    fact_date_start: [
      {
        validator: (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = diffDates(value, plan_date_start) < 0 ||
                                diffDates(value, plan_date_end) > 0;

          if (value && pbs && validInterval) {
            return 'Фактическая дата начала не должна выходить за границы плановых дат';
          }
          return undefined;
        },
      },
      {
        validator: (value, { fact_date_end }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = diffDates(value, fact_date_end) <= 0;

          if (value && pbs && validInterval) {
            return 'Фактическая дата начала не должна быть позже фактичекой даты окончания';
          }
          return undefined;
        },
      },
    ],
    fact_date_end: [
      {
        validator: (value, { plan_date_start, plan_date_end, status }) => {
          const pbs = status && (status === 'assigned' || status === 'complete');
          const validInterval = diffDates(value, plan_date_start) < 0 ||
                                diffDates(value, plan_date_end) > 0;

          if (value && pbs && validInterval) {
            return 'Фактическая дата окончания не должна выходить за границы плановых дат';
          }
          return undefined;
        },
      },
    ],
  },
};

export default dutyMissionSchema;
