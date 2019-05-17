import { SchemaFormContext } from 'components/new/utils/context/form/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

export const waybillFormSchema: SchemaFormContext<Waybill> = {
  header: {
    type: 'waybill',
  },
  body: {
    fields: [
      [
        {
          key: 'waybill_employee_change_status',
          title: '',
        },
        {
          key: 'waybill_structure_and_accompanying_person',
          title: '',
        },
        {
          key: 'waybill_dates',
          title: '',
          md: 6,
        },
      ],
    ],
  },
  footer: {
    type: 'waybill',
  },
};
