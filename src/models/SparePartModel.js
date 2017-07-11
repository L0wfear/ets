export const schema = {
  properties: [
    {
      key: 'number',
      title: 'Номер',
      type: 'string',
      required: true,
    },
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
    },
    {
      key: 'price',
      title: 'Цена',
      type: 'number',
      required: true,
    },
    {
      key: 'spare_part_group_id',
      title: 'Группа',
      type: 'number',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Цена, руб.',
      type: 'number',
      required: true,
    },
  ],
};
