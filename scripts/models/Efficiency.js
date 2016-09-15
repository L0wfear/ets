export const efficiencySchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'source',
      title: 'Источник',
      type: 'number',
      required: true,
    },
    {
      key: 'areal_feature_id',
      title: 'Площадная характеристика',
      type: 'number',
      required: true,
    },
    {
      key: 'ratio',
      title: 'Коэффициент',
      type: 'number',
      required: true,
    },
  ],
};
