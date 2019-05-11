export const maintenanceWorkFormSchema = {
  header: {
    type: 'default',
    title: [
      {
        title: 'Изменение расходного материала',
        disaplayIf: 'IS_CREATING',
      },
      {
        title: 'Добавление расходного материала',
        disaplayIf: 'IS_CREATING',
        reverse: true,
      },
    ],
  },
  body: {
    fields: [
      [
        {
          key: 'name',
          title: 'Наименование',
          type: 'string',
          required: true,
        },
      ],
      [
        {
          key: 'measure_unit_id',
          title: 'Единица измерения',
          type: 'valueOfArray',
          required: true,
          clearable: false,
        },
      ],
    ],
  },
  footer: {
    type: 'default',
    buttons: [
      [
        'save',
        'cancel',
      ],
    ],
  },
};
