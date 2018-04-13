import { getKindTaskIds } from 'components/missions/utils/utils';

export const makeTechnicalOperationOptionfFromWaybill = (technicalOperationsList, { type_id }) =>
  technicalOperationsList.reduce((newArr, technicalOperation) => {
    if (technicalOperation.is_new && technicalOperation.car_func_types.find(({ id }) => id === type_id)) {
      return [
        ...newArr,
        { value: technicalOperation.id, label: technicalOperation.name },
      ];
    }
    return [...newArr];
  }, []);

export const makeTechnicalOperationOptionDefault = (technicalOperationsList, { is_new }) =>
  technicalOperationsList.reduce((newArr, technicalOperation) => {
    if (!is_new || (is_new && technicalOperation.is_new)) {
      return [
        ...newArr,
        { value: technicalOperation.id, label: technicalOperation.name },
      ];
    }

    return [...newArr];
  }, []);

export const getTechnicalOperationData = (formState, fromOrder, fromWaybill, missionSourceAction, technicalOperationsActions) =>
  missionSourceAction()
    .then(({ result: missionSourcesList }) => {
      const kind_task_ids =
        (missionSourcesList.find(({ auto }) => auto).id !== formState.mission_source_id && !fromOrder)
        ?
        getKindTaskIds(formState.id, false)
        :
        null;
      return Promise.all([
        technicalOperationsActions({ kind_task_ids }),
        Promise.resolve(kind_task_ids),
      ]);
    })
    .then(([ { result: technicalOperationsList }, kind_task_ids ]) => {
      if ((fromWaybill || formState.status === 'not_assigned') && formState.type_id) {
        return {
          TECH_OPERATIONS: makeTechnicalOperationOptionfFromWaybill(technicalOperationsList, formState),
          kind_task_ids,
          technicalOperationsList,
        };
      }

      return {
        TECH_OPERATIONS: makeTechnicalOperationOptionDefault(technicalOperationsList, formState),
        kind_task_ids,
        technicalOperationsList,
      };
    });

export const getDataBySelectedRoute = (formState, routesActions, defaultValue = null) => {
  const { route_id } = formState;
  if (route_id) {
    return routesActions(route_id, false);
  }

  return Promise.resolve(defaultValue);
};

export const getRoutesByMissionId = (formState, isTemplate, routesActions, defaultValue) => {
  const { id } = formState;
  if (id) {
    return routesActions(id, isTemplate);
  }

  return Promise.resolve(defaultValue);
};

export const getRoutesBySomeData = (formState, stateData, routeAction) =>
  routeAction({
    municipal_facility_id: formState.municipal_facility_id,
    technical_operation_id: formState.technical_operation_id,
    type: stateData.available_route_types.join(','),
  });

export const handleRouteFormHide = (isSubmitted, result, formState, stateData, routeActionGetRouteById, routeActionGetRoutesBySomeData) => {
  if (isSubmitted) {
    const { createdRoute: { result: [{ id: route_id }] } } = result;

    return Promise.all([
      getDataBySelectedRoute({ route_id }, routeActionGetRouteById),
      getRoutesBySomeData(formState, stateData, routeActionGetRoutesBySomeData),
    ])
    .then(([ selectedRoute, routesList ]) => ({
      showRouteForm: false,
      selectedRoute,
      routesList,
      route_id,
    }));
  }

  return Promise.resolve({
    showRouteForm: false,
    selectedRoute: null,
  });
};

export const getNormDataById = (norm_id, action) =>
  action({ norm_id }).then(({ result: [normData] }) => normData);
export const getCarsByNormId = (norm_id, formState, fromWaybill, action) => {
  if (!formState.status && !fromWaybill) {
    return action({ norm_id }).then(({ result: { rows: carsList } }) => carsList);
  }

  return Promise.resolve(null);
};

export const getDataByNormId = (norm_id, formState, fromWaybill, technicalOperationActionGetOneTechOperationByNormId, routeActionGetRoutesBySomeData, carsActionGetCarsByNormId) =>
  Promise.all([
    getNormDataById(norm_id, technicalOperationActionGetOneTechOperationByNormId),
    getCarsByNormId(norm_id, formState, fromWaybill, carsActionGetCarsByNormId),
  ])
  .then(([ normData, carsList ]) => {
    const { route_types: available_route_types } = normData;

    return getRoutesBySomeData(formState, { available_route_types }, routeActionGetRoutesBySomeData)
      .then(routesList => ({
        normData,
        carsList,
        routesList,
        available_route_types,
        is_cleaning_norm: normData.is_cleaning_norm,
      }));
  });
