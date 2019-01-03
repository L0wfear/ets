export const EMPTY_STUCTURE = 'Без подразделения';
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

export const makeRoutesListForRender = (routesListFromStore) => {
  return routesListFromStore.reduce((newRouteList, r) => {
    r.work_types.forEach(({ work_type_id, work_type_name }) => (
      newRouteList.push({
        ...r,
        front_work_type_id: work_type_id,
        front_work_type_name: work_type_name,
        type_name: getTypeRoute(r.type),
      })
    ));

    return newRouteList;
  }, []);
};
