export const odhNormSchema = {
  properties: [
		{
			key: 'name',
      title: 'Норматив содержания ОДХ',
			type: 'string',
			required: true,
		},
		{
			key: 'unit',
			title: 'Единица измерения',
			type: 'string',
			required: false,
		},
		{
			key: 'expendable',
			title: 'Расходный материал',
			type: 'select',
			required: false,
		}
	],
};
