export type CompanyStructure = {
  id: number | null;
  legal_person_id: number | null;
  name: string | null;
  note: string | null;
  parent_id?: number | null;
  type: number | null;
  children: CompanyStructure[];
  type_display: string | null;

};
export type CompanyStructureLinear = {
  id: number | null;
  legal_person_id: number | null;
  name: string | null;
  note: string | null;
  parent_id: number | null;
  type: number | null;
  type_display: string | null;
  carpool_ids: [],
  carpool_names: [],
};

export type companyStructureDescendantsByUser = CompanyStructureLinear | CompanyStructure;

export type IStateCompanyStructure = {
  companyStructureList: CompanyStructure[];
  companyStructureLinearList: CompanyStructureLinear[],
  companyStructureDescendantsByUserList: companyStructureDescendantsByUser[];
};
