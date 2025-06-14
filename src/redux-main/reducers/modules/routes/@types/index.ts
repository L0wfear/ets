export type DrawData = {
  begin: {
    x_msk: number;
    y_msk: number;
  };
  distance: number;
  end: {
    x_msk: number;
    y_msk: number;
  };
  object_id: number;
  shape: any;
  state: 1 | 2 | 3;
};

export type ObjectDtOdhData = {
  name: string;
  object_id: number;
  state: number;
  type: string;
};

export type ObjectPointData = {
  coordinates: [number, number];
  frontId: number;
  name: string;
  object_id: number;
  object_name: string;
  shape: {
    type: 'Point';
    coordinates: [number, number];
  };
  type: 'points' | null;
};

export type SeasonData = {
  season_id: number;
  season_name: string;
};

export type WorkTypeData = {
  work_type_id: number;
  work_type_name: string;
};

export type OdhValidate = {
  odh_id: number;
  odh_name: string;
  state: number | null;
  status: 'fail' | 'success';
};

export type Route = {
  name: string;
  draw_object_list: Array<DrawData | ObjectDtOdhData>;
  input_lines: Array<DrawData>;
  object_list: Array<ObjectDtOdhData> | Array<ObjectPointData>;
  comment: string;
  company_id: number | null;
  created_at: string;
  id: number;
  is_main: boolean;
  is_new: boolean;
  is_template: boolean;
  municipal_facility_id: number | null;
  municipal_facility_name: string | null;
  norm_id: null;
  seasons: Array<SeasonData>;
  structure_id: number | null;
  structure_name: string | null;
  technical_operation_id: number;
  technical_operation_name: string;
  type: 'mixed' | 'simple_dt' | 'points';
  work_types: Array<WorkTypeData>;
  work_type_code: number;
  work_type_name: string;
};

export type IStateRoutes = {
  routesList: Array<Route>;
  routesIndex: Record<Route['id'], Route>;
};
