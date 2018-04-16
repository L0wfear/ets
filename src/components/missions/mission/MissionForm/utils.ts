import { getKindTaskIds } from 'components/missions/utils/utils';

interface IFormState {
  id?: number;
  is_new?: boolean;
  mission_source_id?: number;
  route_id?: number;
  status?: string | void;
  type_id?: number;
}
interface ITechnicalOperation {
  car_func_types: { id: number }[];
  id: number;
  is_new: boolean;
  name: string;
}

interface ITechnicalOperation {
  value: number;
  label: any;
}

type TMakeTechnicalOperationOptionfFromWaybill = (technicalOperationsList: ITechnicalOperation[], formState: IFormState) => ITechnicalOperation[];

/**
 * Создание TECH_OPERATIONS по type_id
 * @param technicalOperationsList массив тех операций
 * @param fromState объект с полем type_id
 * @returns TECHNICAL_OPERATION
 */
export const makeTechnicalOperationOptionfFromWaybill: TMakeTechnicalOperationOptionfFromWaybill = (technicalOperationsList, { type_id }) =>
  technicalOperationsList.reduce((newArr, technicalOperation) => {
    if (technicalOperation.is_new && technicalOperation.car_func_types.find(({ id }) => id === type_id)) {
      return [
        ...newArr,
        { value: technicalOperation.id, label: technicalOperation.name },
      ];
    }
    return [...newArr];
  }, []);

type TMakeTechnicalOperationOptionDefault = (technicalOperationsList: ITechnicalOperation[], formState: IFormState) => ITechnicalOperation[];
/**
 * Создание TECH_OPERATIONS по is_new
 * @param technicalOperationsList массив тех операций
 * @param fromState объект с полем is_new
 * @returns TECHNICAL_OPERATION
 */
export const makeTechnicalOperationOptionDefault: TMakeTechnicalOperationOptionDefault = (technicalOperationsList, { is_new }) =>
  technicalOperationsList.reduce((newArr, technicalOperation) => {
    if (!is_new || (is_new && technicalOperation.is_new)) {
      return [
        ...newArr,
        { value: technicalOperation.id, label: technicalOperation.name },
      ];
    }

    return [...newArr];
  }, []);

type TGetTechnicalOperationData = (
  formState: IFormState,
  fromOrder: boolean,
  fromWaybill: boolean,
  missionSourceAction: () => Promise<any>,
  technicalOperationsActions: ({ kind_task_ids: string }) => Promise<any>,
) => Promise<{
  TECH_OPERATIONS: ITechnicalOperation[],
  kind_task_ids: string | void;
  technicalOperationsList: ITechnicalOperation[];
}>;

/**
 * 
 * @param formState состояние формы
 * @param fromOrder создание из реестра факсограмм?
 * @param fromWaybill создание из реестра ПЛ?
 * @param missionSourceAction Получение списка источников заданий
 * @param technicalOperationsActions Получение списка тех операций
 */
export const getTechnicalOperationData: TGetTechnicalOperationData = (formState, fromOrder, fromWaybill, missionSourceAction, technicalOperationsActions) =>
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

type TGetDataBySelectedRoute = (
  formState: IFormState,
  routesActions: (route_id: number, flag: boolean) => Promise<any>,
  defaultValue?: any,
) => Promise<any>;
/**
 * Получение информации по выбранному маршруту
 * @param formState состояние формы
 * @param routesActions экшн получения маршрутов
 * @param defaultValue значение по умолчанию (по умолчанию null)
 */
export const getDataBySelectedRoute: TGetDataBySelectedRoute = (formState, routesActions, defaultValue = null) => {
  const { route_id } = formState;
  if (route_id) {
    return routesActions(route_id, false);
  }

  return Promise.resolve(defaultValue);
};

type IGetRoutesByMissionId = (
  formState: IFormState,
  isTemplate: boolean,
  routeAction: (id: number, isTemplate: boolean) => Promise<any>,
  defaultValue: any,
) => Promise<any>;
/**
 * Получени списка маршрутов по id задания
 * @param formState состояние формы
 * @param isTemplate это шаблон?
 * @param routesActions экшн получения маршрутов
 * @param defaultValue значение по умолчанию
 */
export const getRoutesByMissionId: IGetRoutesByMissionId = (formState, isTemplate, routesActions, defaultValue) => {
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
