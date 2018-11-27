export type SparePart = {
  company_id?: number | null;
  company_name?: string | null;
  group_name?: string | null;
  id: number | null;
  measure_unit_id: number | null;
  measure_unit_name?: string | null;
  name: string | null;
  number: string | null;
  quantity: number | null;
  spare_part_group_id: number | null;
  supplied_at: string | null;
};

export type MeasureUnit = {
  id: number;
  name: string;
};

export type SparePartGroup = {
  id: number;
  name: string;
};

export type IStateAutobase = {
  sparePartList: SparePart[];
  measureUnitList: MeasureUnit[];
  sparePartGroupList: SparePartGroup[];
};
