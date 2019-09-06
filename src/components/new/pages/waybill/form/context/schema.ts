import { SchemaFormContext } from 'components/@next/@form/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

export const waybillFormSchema: SchemaFormContext<Waybill> = {
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
