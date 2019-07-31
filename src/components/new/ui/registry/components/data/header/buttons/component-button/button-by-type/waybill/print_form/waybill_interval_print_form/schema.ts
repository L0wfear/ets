import { SchemaType } from "components/old/ui/form/new/@types/validate.h";
import { WaybillsReportForm } from "./@types";

export const waybillsReportFormSchema: SchemaType<WaybillsReportForm, any> = {
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
