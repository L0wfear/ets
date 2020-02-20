import { Route } from '../../routes/@types';

export type TechnicalOperationRelationsRoute = {
  id: number;
  name: string;
  structure_name: string;
  type: Route['type'];
};

export type TechnicalOperationRelations = {
  asuods_id: number;
  employees: string;
  gov_number: string;
  route_names: string;
  route_names_string: string;
  route_names_only: Array<string>;
  routes: Array<TechnicalOperationRelationsRoute>;
};
