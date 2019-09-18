import { GlobalFormSchemaType } from "components/new/GlobalForms";

export const globalFormShema: GlobalFormSchemaType = {
  dataInSearchKeyList: [
    {
      type: 'string',
      key: 'showFormType',
      required: true,
    },
    {
      type: 'number',
      key: 'inspectId',
      required: true,
    },
    {
      type: 'string',
      key: 'showCreateBtn',
      required: true,
    },
  ],
};
