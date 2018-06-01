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
      required: false,
    },
    {
      key: 'draw_object_list',
      title: 'Геоданные маршрута',
      type: 'array',
      required: false,
    },
    {
      key: 'input_lines',
      title: 'Геоданные маршрута',
      type: 'array',
      required: false,
    },
  ],
};
