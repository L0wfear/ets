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
  ],
  dependencies: {
    'object_list': [
      {
        validator: (value, formData) => {
          if ((!value || value.length === 0) && (!formData.draw_object_list || formData.draw_object_list.length === 0)) {
            return 'Поле "Геоданные маршрута" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    'draw_object_list': [
      {
        validator: (value, formData) => {
          if ((!value || value.length === 0) && (!formData.object_list || formData.object_list.length === 0)) {
            return 'Поле "Геоданные маршрута" должно быть заполнено';
          }
          return false;
        },
      },
    ],
  },
};
