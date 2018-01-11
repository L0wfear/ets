export const routeSchema = {
  properties: [
    {
      key: 'technical_operation_id',
      title: 'Технологическая операция',
      type: 'number',
      required: true,
    },
    {
      key: 'municipal_facility_id',
      title: 'Элемент',
      type: 'number',
    },
    {
      key: 'name',
      title: 'Название маршрута',
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
    'municipal_facility_id': [
      {
        validator: (value, { is_new }) => {
          if (is_new) {
            if (!value) {
              return 'Поле "Элемент" должно быть заполнено';
            }
          }
          return false;
        },
      },
    ],
    'object_list': [
      {
        validator: (value, formData) => {
          if ((!value || value.length === 0) && (!formData.draw_object_list || formData.draw_object_list.length === 0)) {
            if (formData.type === 'mixed') {
              return 'Поле "Список выбранных ОДХ" должно быть заполнено';
            }
            if (formData.type === 'simple_dt') {
              return 'Поле "Список выбранных ДТ" должно быть заполнено';
            }
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
