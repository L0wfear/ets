import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { WaybillPrintJournalForm } from './@types';

export const waybillPrintJournalFormSchema: SchemaType<WaybillPrintJournalForm, any> = {
  properties: {
    month: {
      type: 'number',
      title: 'Месяц',
      required: true,
      validateIf: {
        type: 'equal_to_value',
        path: 'formationPeriod',
        value: 'month',
      },
    },
    year: {
      type: 'number',
      title: 'Год',
      required: true,
      validateIf: {
        type: 'equal_to_value',
        path: 'formationPeriod',
        value: 'month',
      },
    },
    formationPeriod: {
      title: 'Период формирования',
      type: 'valueOfArray',
    },
    date: {
      type: 'date',
      title: 'Дата',
      required: true,
      validateIf: {
        type: 'equal_to_value',
        path: 'formationPeriod',
        value: 'day',
      },
    },
  },
};
