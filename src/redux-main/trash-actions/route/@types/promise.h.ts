export type DrawData = {
  begin: {
    x_msk: number;
    y_msk: number;
  },
  distance: number;
  end: {
    x_msk: number;
    y_msk: number;  
  };
  object_id: number;
  shape: GlobalObject;
  state: 1 | 2 | 3;
};

export type ObjectDtOdhData = {
  name: string;
  object_id: number;
  state: number;
  type: 'odh' | 'dt';
};

export type ObjectPointData = {
  coordinates: [number, number];
  frontId: number;
  name: string;
  object_id: number | void;
  object_name: string | void;
  shape: {
    type: 'Point',
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

export type RouteType = {
  name: string;
  draw_object_list: DrawData[];
  input_lines: DrawData[];
  object_list: (ObjectDtOdhData & ObjectPointData)[];
  comment: null | void;
  company_id: number | void;
  created_at: string;
  id: number;
  is_main: boolean;
  is_new: boolean;
  is_template: boolean;
  municipal_facility_id: number;
  norm_id: null;
  seasons: SeasonData[];
  structure_id: number | void;
  structure_name: string | void;
  technical_operation_id: number;
  technical_operation_name: string;
  type: 'mixed' | 'simple_dt' | 'points';
  work_types: WorkTypeData[]
};

export type AnsGetRouteDataById = {
  route_data: RouteType;
};
