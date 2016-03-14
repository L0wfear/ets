
export const dutyMissionTemplateSchema = {
	properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'number',
			required: true,
		},
		{
			key: 'route_id',
			title: 'Маршрут',
			type: 'number',
			required: true,
		},
		{
			key: 'comment',
			title: 'Комментарий',
			type: 'number',
			required: false,
		},
	],
};
