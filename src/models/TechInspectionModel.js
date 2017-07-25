export const schema = {
  properties: [
    {
      key: 'reg_number',
      title: 'Регистрационный номер',
      type: 'number',
      required: true,
      maxLength: 21,
    },
    {
      key: 'date_end',
      title: 'Срок действия до',
      type: 'date',
      required: true,
    },
    {
      key: 'date_start',
      title: 'Дата прохождения',
      type: 'date',
      required: true,
    },
    {
      key: 'tech_operator',
      title: 'Оператор технического осмотра / пункт технического осмотра',
      type: 'text',
      maxLength: 256,
    },
    {
      key: 'is_allowed',
      title: 'Заключение о возможности/невозможности эксплуатации ТС',
      type: 'number',
    },
    {
      key: 'note',
      title: 'Примечание прохождения',
      type: 'text',
    },
  ],
};
