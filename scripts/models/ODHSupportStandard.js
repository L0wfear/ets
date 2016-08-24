export const odhSupportStandardSchema = {
  properties: [
		{
			key: 'standard',
      title: 'unit',
			type: 'string',
			required: true,
		},
		{
			key: 'unit',
			title: 'Источник получения задания',
			type: 'string',
			required: false,
		}
	],
};
