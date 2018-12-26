export const missionSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'structure_id',
      title: 'Подразделение',
      type: 'number',
      required: false,
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
      // type: 'array',
      required: true,
    },
    {
      key: 'is_column',
      title: 'Создать задания на колонну',
      type: 'boolean',
    },
    {
      key: 'route_id',
      title: 'Маршрут',
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
      key: 'date_start',
      title: 'Время выполнения, с',
      type: 'datetime',
      required: true,
    },
    {
      key: 'date_end',
      title: 'Время выполнения, по',
      type: 'datetime',
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'number',
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
    'date_end': [
      {
        type: 'gt',
        field: 'date_start',
      },
    ],
    'municipal_facility_id': [
      {
        validator: (value) => {
          if (!value) {
            return 'Поле "Элемент" должно быть заполнено';
          }
          return undefined;
        },
      },
    ],
    'car_id': [
      {
        validator: (value = [], { is_column }) => {
          if (!value || value.length === 0) {
            return 'Поле "Транспортное средство" должно быть заполнено';
          }

          if (is_column && Array.isArray(value) && value.length === 1) {
            return 'Для создания задания на колонну должно быть выбрано более одного ТС';
          }

          return undefined;
        },
      },
    ],
  },
};
