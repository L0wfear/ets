import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsRepairCompany } from 'components/directories/autobase/repair_company/RepairCompanyForm/@types/RepairCompany.h';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const repairCompanyFormSchema: SchemaType<RepairCompany, PropsRepairCompany> = {
  properties: [
    {
      key: 'name',
      title: 'Наименование ремонтной организации',
      type: 'string',
      required: true,
      maxLength: 128,
    },
    {
      key: 'comment',
      title: 'Примечание',
      type: 'string',
      maxLength: 1024,
    },
  ],
};
