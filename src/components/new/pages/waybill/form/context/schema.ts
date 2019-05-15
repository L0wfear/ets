import { SchemaFormContext } from 'components/new/utils/context/@types';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

export const waybillFormSchema: SchemaFormContext<Waybill> = {
  header: {
    type: 'waybill',
  },
  body: {
    fields: [],
  },
  footer: {
    type: 'waybill',
  },
};
