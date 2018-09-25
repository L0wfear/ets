
export type ObjectListType = {
  name: string;
  object_id: number;
  state: 1 | 2 | 3;
  type: 'odh' | 'dt';
};

/**
 * @todo описать draw_object_list
 * @todo описать input_lines
 */
export type RouteType = {
  company_id: number | void;
  draw_object_list: any[];
  id: number;
  input_lines: any[] | void;
  is_template: boolean;
  name: string;
  object_list: ObjectListType[];
  structure_id: number | void;
  structure_name: string | void;
  technical_operation_id: number;
  technical_operation_name: string;
  type: 'mixed' | 'simple_dt' | 'points';
};

export type AnsGetRouteDataById = {
  route_data: RouteType;
};
