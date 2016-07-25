export const missionSchema = {
  properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'number',
			required: true,
		},
		{
			key: 'passes_count',
			title: 'Количество проходов',
			type: 'number',
			required: true,
      max: 10,
      min: 0,
		},
		{
			key: 'car_id',
			title: 'Транспортное средство',
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
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'number',
      required: true,
    }
	],
};

const closingProperties = [];

export const missionClosingSchema = {
  properties: closingProperties
};
