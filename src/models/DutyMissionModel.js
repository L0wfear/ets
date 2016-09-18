export const dutyMissionSchema = {
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
};
