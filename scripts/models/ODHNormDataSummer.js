export const odhNormSchema = {
  properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'number',
			required: true,
		},
		{
			key: 'standard_id',
			title: 'Норматив содержания ОДХ',
			type: 'number',
			required: true,
		},
		{
			key: 'unit',
			title: 'Единица измерения',
			type: 'string',
			required: false,
		},
		{
			key: 'categorized_1',
			title: '1',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_2',
			title: '2',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_3',
			title: '3',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_4',
			title: '4',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_5',
			title: '5',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_6a',
			title: '6а',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_6b',
			title: '6б',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_6c',
			title: '6в',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_7a',
			title: '7а',
			type: 'number',
			required: false,
		},
		{
			key: 'categorized_7b',
			title: '7б',
			type: 'number',
			required: false,
		},
		{
			key: 'uncategorized_highway',
			title: 'Магистрали (направления "Внуковское", "Рублевское", "Шереметьевское")',
			type: 'number',
			required: false,
		},
		{
			key: 'uncategorized_odhs_center',
			title: 'ОДХ внутри Садового кольца',
			type: 'number',
			required: false,
		},
		{
			key: 'uncategorized_odhs_other',
			title: 'ОДХ на территории ТиНАО, не отнесенные к иным категориям на территории г. Москвы',
			type: 'number',
			required: false,
		}
	],
};
