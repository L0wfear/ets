export const missionsCreationTemplateSchema = {
  properties: [
    {
      key: 'passes_count',
      title: 'Количество циклов',
      type: 'number',
      required: false,
      max: 10,
    },
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'number',
      required: false,
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
