export const schema = {
  properties: [
    {
      key: 'id_org',
      title: 'Организация',
      type: 'number',
      required: true,
    },
    {
      key: 'battery_brand__name',
      title: 'Марка аккумулятора',
      type: 'string',
      required: true,
    },
    {
      key: 'battery_manufacturer__name',
      title: 'Изготовитель',
      type: 'string',
      required: true,
    },
    {
      key: 'battery__serial_number',
      title: 'Серийный номер',
      type: 'string',
      required: true,
    },
    {
      key: 'battery__lifetime_months',
      title: 'Срок службы, мес.',
      type: 'number',
      required: true,
    },
    {
      key: 'battery__released_at',
      title: 'Дата выпуска',
      type: 'date',
      required: true,
    },
  ],
};
