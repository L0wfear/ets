
export const getTypeRoute = (type) => {
  switch (type) {
    case 'mixed':
    case 'simple':
    case 'vector':
      return 'Маршруты по ОДХ';
    case 'simple_dt':
      return 'Маршруты по ДТ';
    case 'points':
      return 'Маршруты по пунктам назначения';
    default:
      return 'error';
  }
};

export const makeRoutesListForRender = (routesListFromStore, technicalOperationsList, STRUCTURES) => {
  routesListFromStore.forEach((r) => {
    r.technical_operation_name = _.get(technicalOperationsList.find(t => t.id === r.technical_operation_id), 'name');
    r.structure_name = _.get(STRUCTURES.find(t => t.value === r.structure_id), 'label');
    r.type_name = getTypeRoute(r.type);
  });
  return routesListFromStore;
};
