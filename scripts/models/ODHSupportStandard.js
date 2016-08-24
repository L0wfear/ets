export const odhSupportStandardSchema = {
  properties: [
		{
			key: 'standard',
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
