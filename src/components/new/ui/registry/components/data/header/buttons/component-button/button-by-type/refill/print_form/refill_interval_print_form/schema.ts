import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { RefillReportForm } from './@types';

export const refillReportFormSchema: SchemaType<RefillReportForm, any> = {
  properties: {
    date_start: {
      type: 'datetime',
      title: 'Время.C',
      required: true,
    },
    date_end: {
      type: 'datetime',
      title: 'Время.По',
      required: true,
    },
  },
};
