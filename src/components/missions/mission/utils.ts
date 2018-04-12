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

  return Promise.resolve(null);
};

export const getRoutesByMissionId = (formState, isTemplate, routesActions, defaultValue) => {
  const { id } = formState;
  if (id) {
    return routesActions(id, isTemplate);
  }

  return Promise.resolve(defaultValue);
};
