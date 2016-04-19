const fuelRateSchema = {
  properties: [
		{
			key: 'operation_id',
      title: 'Операция',
			type: 'number',
			required: true,
		},
    {
			key: 'summer_rate',
      title: 'Норма для летнего периода',
			type: 'number',
			required: false,
		},
    {
			key: 'winter_rate',
      title: 'Норма для зимнего периода',
			type: 'number',
			required: false,
		},
    {
			key: 'car_special_model_id',
      title: 'Модель ТС',
			type: 'number',
			required: true,
		},
    {
			key: 'car_model_id',
      title: 'Марка шасси',
			type: 'number',
			required: false,
		}
	],
};

export default fuelRateSchema;
