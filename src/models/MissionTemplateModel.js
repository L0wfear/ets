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
      key: 'car_ids',
      title: 'Транспортное средство',
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
    'car_ids': [
      {
        validator: (value = [], { for_column }) => {
          if (!value || value.length === 0) {
            return 'Поле "Транспортное средство" должно быть заполнено';
          }

          if (for_column && Array.isArray(value) && value.length === 1) {
            return 'Для создания задания на колонну должно быть выбрано более одного ТС';
          }

          return undefined;
        },
      },
    ],
  },
};
