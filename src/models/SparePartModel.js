export const schema = {
  properties: [
    {
      key: 'number',
      title: 'Номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
      maxLength: 1024,
    },
    {
      key: 'price',
      title: 'Цена',
      type: 'number',
      required: false,
      maxLength: 128,
    },
    {
      key: 'spare_part_group_id',
      title: 'Группа',
      type: 'number',
      required: true,
    },
    {
      key: 'measure_unit_id',
      title: 'Единица измерения',
      type: 'number',
      required: true,
    },
  ],
};
