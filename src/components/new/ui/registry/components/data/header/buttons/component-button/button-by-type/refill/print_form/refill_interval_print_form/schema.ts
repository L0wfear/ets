import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { RefillReportForm } from './@types';

export const refillReportFormSchema: SchemaType<RefillReportForm, any> = {
  properties: {
    date_from: {
      type: 'datetime',
      title: 'Время.C',
      required: true,
    },
    date_to: {
      type: 'datetime',
      title: 'Время.По',
      required: true,
    },
  },
};
