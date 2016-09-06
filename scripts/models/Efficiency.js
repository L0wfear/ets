export const efficiencySchema = {
  properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'select',
			required: true,
		},
		{
			key: 'source',
      title: 'Источник',
			type: 'select',
			required: true,
		},
		{
			key: 'areal_feature_id',
      title: 'Площадная характеристика',
			type: 'select',
			required: true,
		},
		{
			key: 'ratio',
      title: 'Коэффициент',
			type: 'string',
			required: true,
		}
	],
};
