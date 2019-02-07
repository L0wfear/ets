export type CompanyStructure = {
  id: number | null;
  legal_person_id: number | null;
  name: string | null;
  note: string | null;
  parent_id?: number | null;
  type: number | null;
};
export type CompanyStructureLinear = {
  id: number | null;
  legal_person_id: number | null;
  name: string | null;
  note: string | null;
  parent_id: number | null;
  type: number | null;
};

export type companyStructureDescendantsByUser = CompanyStructureLinear | CompanyStructure;

export type IStateCompanyStructure = {
  companyStructureList: CompanyStructure[];
  companyStructureLinearList: CompanyStructureLinear[],
  companyStructureDescendantsByUserList: companyStructureDescendantsByUser[];
};
