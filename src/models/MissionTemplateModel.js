export const missionTemplateSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'number',
      required: true,
    },
    {
      key: 'passes_count',
      title: 'Количество циклов',
      type: 'number',
      required: true,
      integer: true,
      max: 10,
    },
    {
      key: 'car_id',
      title: 'Транспортное средство',
      type: 'number',
      required: true,
    },
    {
      key: 'route_id',
      title: 'Маршрут',
      type: 'number',
      required: true,
    },
  ],
  dependencies: {
    passes_count: [
      {
        validator(value) {
          if (value < 1)
            return '"Количество циклов" должно быть больше 0';
        }
      }
    ],
  },
};
