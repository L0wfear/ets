export const waybillFormSchema: any = {
  header: {
    type: 'waybill',
  },
  body: {
    fields: [
      [
        {
          key: 'waybill_form_body',
          title: '',
        },
      ],
    ],
  },
  footer: {
    type: 'waybill',
  },
};
