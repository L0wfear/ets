export type Odh = {
  auto_footway_area: number | null;
  auto_roadway_clean_area: number | null;
  clean_category_name: string;
  cleaning_area: number | null;
  company_id: number | null;
  company_name: string;
  company_structures: Array<{
    id: number;
    name: string;
  }>;
  customer_id: number | null;
  distance: number | null;
  footway_area: number | null;
  footway_length: number | null;
  gutters_length: number | null;
  id: number | null;
  manual_footway_area: number | null;
  margin_area: number | null;
  name: string;
  okrug_name: string;
  roadway_area: number | null;
  shape: object;
  snow_area: number | null;
  total_area: number | null;
  total_auto_clean_area: number | null;
};
