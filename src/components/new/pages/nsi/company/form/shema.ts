import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsCompany } from 'components/new/pages/nsi/company/form/@types/CompanyList.h';
import { Company } from 'redux-main/reducers/modules/company/@types';

export const companySchema: SchemaType<Company, PropsCompany> = {
  properties: [
    {
      key: 'short_name',
      title: 'Наименование',
      type: 'string',
      required: false,
    },
    {
      key: 'has_remote_checkup',
      title: 'Наличие дистанционного мед. осмотра',
      type: 'boolean',
      required: false,
    },
  ],
};
