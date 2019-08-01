import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { PropsCompanyStructure } from 'components/new/pages/nsi/company_structure/form/@types/CompanyStructureForm';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const companyStructureFormSchema: SchemaType<CompanyStructure, PropsCompanyStructure> = {
  properties: {
    type: {
      title: 'Тип подразделения',
      type: 'number',
      integer: true,
      required: true,
    },
    name: {
      title: 'Наименование',
      type: 'string',
      required: true,
    },
  },
};
