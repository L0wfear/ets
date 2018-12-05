export const missionsCreationTemplateSchema = {
  properties: [
    {
      key: 'passes_count',
      title: 'Количество циклов',
      type: 'number',
      required: true,
      max: 10,
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
      key: 'mission_source_id',
      title: 'Источник получения задания',
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
  },
};
