export const schema = {
  properties: [
    {
      key: 'brand_id',
      title: 'Марка аккумулятора',
      type: 'number',
      required: true,
    },
    {
      key: 'serial_number',
      title: 'Серийный номер',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'lifetime_months',
      title: 'Срок службы, мес.',
      type: 'number',
      required: true,
      maxLength: 128,
    },
    {
      key: 'released_at',
      title: 'Дата выпуска',
      type: 'date',
      required: true,
    },
  ],
};
