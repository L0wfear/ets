export const missionsCreationTemplateSchema = {
  properties: [
    {
      key: 'passes_count',
      title: 'Количество проходов',
      type: 'number',
      required: false,
      min: 0,
      max: 10,
    },
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'number',
      required: false,
    },
  ],
};
