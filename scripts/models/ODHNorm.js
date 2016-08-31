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
		}
	],
};
