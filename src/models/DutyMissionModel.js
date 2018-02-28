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
  },
};

export default dutyMissionSchema;
