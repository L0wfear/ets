import { getKindTaskIds } from 'components/missions/utils/utils';
import { AvailableRouteTypes } from 'components/missions/mission/MissionForm/types';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

interface IFormState {
  id?: number;
  is_new?: boolean;
  mission_source_id?: number;
  route_id?: number;
  status?: string | void;
  car_id?: number;
  type_id?: number;
}
interface ITechnicalOperation {
  car_func_types: { id: number, asuods_id: number }[];
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
    if (technicalOperation.is_new && technicalOperation.car_func_types.find(({ asuods_id }) => asuods_id === type_id)) {
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

interface ITechnicalOperationActionsProps {
  kind_task_ids?: string;
  for?: string;
  car_id?: number;
}

type TGetTechnicalOperationData = (
  formState: IFormState,
  isTemplate: boolean,
  fromOrder: boolean,
  withDefineCarId: boolean,
  missionSourceAction: () => Promise<any>,
  technicalOperationsActions: (props: ITechnicalOperationActionsProps) => Promise<any>,
) => Promise<{
  TECH_OPERATIONS: ITechnicalOperation[],
  kind_task_ids: string | void;
  technicalOperationsList: ITechnicalOperation[];
}>;

/**
 * @param formState состояние формы
 * @param fromOrder создание из реестра факсограмм?
 * @param withDefineCarId тс нельзя изменить
 * @param missionSourceAction Получение списка источников заданий
 * @param technicalOperationsActions Получение списка тех операций
 */
export const getTechnicalOperationData: TGetTechnicalOperationData = (formState, isTemplate, fromOrder, withDefineCarId, missionSourceAction, technicalOperationsActions) =>
  missionSourceAction()
    .then(({ order_mission_source_id }) => {
      const kind_task_ids =
        (!isTemplate && order_mission_source_id !== formState.mission_source_id && !fromOrder)
        ?
          getKindTaskIds(formState.id, false)
        :
          null
        ;
      return Promise.all([
        technicalOperationsActions({ kind_task_ids, for: 'mission', car_id: formState.car_id }),
        Promise.resolve(kind_task_ids),
      ]);
    })
    .then(([ { result: technicalOperationsList }, kind_task_ids ]) => {
      if ((withDefineCarId || formState.status === 'not_assigned') && formState.car_id) {
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

export const handleRouteFormHide = (formState, stateData, routeActionGetRoutesBySomeData) => {
  return Promise.all([
    getRoutesBySomeData(formState, stateData, routeActionGetRoutesBySomeData),
  ])
  .then(([ routesList ]) => ({
    routesList,
  }));
};

export const getNormDataByNormatives = (normatives, kind_task_ids, action) =>
  action({ norm_ids: normatives.map(({ id }) => id).join(','), kind_task_ids }).then(({ result: normativesData }) => normativesData)
;
export const getCarsByNormNormatives = (normatives, formState, withDefineCarId, action) => {
  if (!formState.status && !withDefineCarId || formState.can_edit_car_and_route) {
    return action({ norm_ids: normatives.map(({ id }) => id).join(',') }).then(({ result: { rows: carsList } }) => carsList);
  }

  return Promise.resolve(null);
};

export const getDataByNormatives = (normatives, kind_task_ids, formState, withDefineCarId, getTechOperationsByNormIds, routeActionGetRoutesBySomeData, getCarsByNormIds) =>
  Promise.all([
    getNormDataByNormatives(normatives, kind_task_ids, getTechOperationsByNormIds),
    getCarsByNormNormatives(normatives, formState, withDefineCarId, getCarsByNormIds),
  ])
  .then(([ normativesData, carsList ]) => {
    const available_route_types = normativesData.reduce((newArr, { route_types }) => [...newArr, ...route_types], []);

    return getRoutesBySomeData(formState, { available_route_types }, routeActionGetRoutesBySomeData)
      .then((routesList) => ({
        normativesData,
        carsList,
        routesList,
        available_route_types,
      }));
  });

export const isOdhRouteTypePermitted = (types: string[]) => types.includes(AvailableRouteTypes.Mixed);

export const makeCarOptionLabel = (car: Car | null) => (
  car
    ? (
      `${car.gov_number} [${car.model_name || ''}${car.model_name ? '/' : ''}${car.special_model_name || ''}${car.type_name ? '/' : ''}${car.type_name || ''}]`
    )
    : (
      ''
    )
);

export const makePayloadFromState = (formState, type_id) => ({
  datetime: formState.date_start,
  technical_operation_id: formState.technical_operation_id,
  municipal_facility_id: formState.municipal_facility_id,
  route_type: formState.route_type,
  func_type_id: type_id || formState.type_id,
  needs_brigade: false,
});
