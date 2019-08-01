import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsRepairCompany } from 'components/new/pages/nsi/autobase/pages/repair_company/form/@types/RepairCompanyForm';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const repairCompanyFormSchema: SchemaType<RepairCompany, PropsRepairCompany> = {
  properties: {
    name: {
      title: 'Наименование ремонтной организации',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    comment: {
      title: 'Примечание',
      type: 'string',
      maxLength: 1024,
    },
  },
};
