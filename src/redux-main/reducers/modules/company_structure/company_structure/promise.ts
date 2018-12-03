import {
  companyStructureLoadCompanyStructure,
  companyStructureLoadCompanyStructureLineat,
} from 'redux-main/reducers/modules/company_structure/promises';
import { keyBy } from 'lodash';

export const getCompanyStructure = companyStructureLoadCompanyStructure;
export const getCompanyStructureLinear = companyStructureLoadCompanyStructureLineat;

export const getSetCompanyStructure = async (...payload) => {
  const { data } = await getCompanyStructure(...payload);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};
export const getSetCompanyStructureLinear = async (...payload) => {
  const { data } = await getCompanyStructureLinear(...payload);

  return {
    data,
    dataIndex: keyBy(data, 'id'),
  };
};
