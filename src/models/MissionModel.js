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
      min: 1,
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
      key: 'norm_id',
      title: 'Норматив',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'number',
      required: true,
    },
  ],
  dependencies: {
    'date_end': [
      {
        type: 'gt',
        field: 'date_start',
      },
    ],
  },
};
