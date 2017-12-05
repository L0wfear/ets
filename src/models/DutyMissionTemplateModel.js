const dutyMissionTemplateSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
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
      type: 'array',
      required: true,
    },
    {
      key: 'comment',
      title: 'Комментарий',
      type: 'string',
      required: false,
    },
  ],
};

export default {
  dutyMissionTemplateSchema,
};
