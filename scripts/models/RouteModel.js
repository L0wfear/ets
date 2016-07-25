export const routeSchema = {
  properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'number',
			required: true,
		},
		{
			key: 'name',
			title: 'Название',
			type: 'string',
			required: true,
		},
		{
			key: 'object_list',
			title: 'Геоданные маршрута',
			type: 'array',
			required: true,
		},
	],
};
