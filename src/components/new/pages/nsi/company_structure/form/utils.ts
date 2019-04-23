import { isObject, isNullOrUndefined } from 'util';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export type GetdefaultCompanyStructureElement = (companyStructure: CompanyStructure | null) => CompanyStructure;

export const defaultCompanyStructure: CompanyStructure = {
  id: null,
  legal_person_id: null,
  name: '',
  note: '',
  parent_id: null,
  type: null,
  children: [],
};

export const getdefaultCompanyStructureElement: GetdefaultCompanyStructureElement = (element) => {
  const newElement = { ...defaultCompanyStructure };
  if (isObject(element)) {
    Object.keys(defaultCompanyStructure).forEach((key) => {
      newElement[key] = !isNullOrUndefined(element[key]) ? element[key] : defaultCompanyStructure[key];
    });
  }

  return newElement;
};

export const STRUCTURE_TYPE_DEY = { value: 3, label: 'ДЭУ' };
export const STRUCTURE_TYPE_DEK = { value: 2, label: 'ДЭК' };

export const STRUCTURE_TYPES = {
  half: [
    STRUCTURE_TYPE_DEY,
  ],
  all: [
    STRUCTURE_TYPE_DEY,
    STRUCTURE_TYPE_DEK,
  ],
};
