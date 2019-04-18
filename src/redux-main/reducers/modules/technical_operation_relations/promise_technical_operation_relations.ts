import { cloneDeep } from 'lodash';
import { TechnicalOperationRelations } from './@types/technicalOperationRelations';

export const getFrontTechnicalOperationRelations = (technicalOperationRelationsOwn: TechnicalOperationRelations, index: number) => {
  const technicalOperationRelations: TechnicalOperationRelations = cloneDeep(technicalOperationRelationsOwn);

  technicalOperationRelations.route_names_only = technicalOperationRelations.routes.map(({ name }) => name);

  return technicalOperationRelations;
};

export const getBackTechnicalOperationRelations = (technicalOperationRelationsOwn: TechnicalOperationRelations) => {
  const technicalOperationRelations = cloneDeep(technicalOperationRelationsOwn);

  delete technicalOperationRelations.route_names_only;

  return technicalOperationRelations;
};
