import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsCompanyStructure } from 'components/company_structure/CompanyStructureForm/@types/CompanyStructureForm.h';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const companyStructureFormSchema: SchemaType<CompanyStructure, PropsCompanyStructure> = {
  properties: [
    {
      key: 'type',
      title: 'Тип подразделения',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'name',
      title: 'Наименование',
      type: 'string',
      required: true,
    },
  ],
};
