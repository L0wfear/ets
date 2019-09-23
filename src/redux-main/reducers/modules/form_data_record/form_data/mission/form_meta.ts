import { get } from 'lodash';

import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import missionPermissions from 'components/new/pages/missions/mission/_config-data/permissions';
import { promiseSubmitMission, promiseGetMissionById } from 'redux-main/reducers/modules/missions/mission/promise';
import { createValidDateTime, getTomorrow9am, getDateWithMoscowTz, diffDates } from 'components/@next/@utils/dates/dates';
import { routeTypesByTitle } from 'constants/route';
import { getMissionsState } from 'redux-main/reducers/selectors';

export const metaMission: ConfigFormData<Mission> = {
  uniqField: 'id',
  bsSizeForm: 'large',
  permissions: missionPermissions,
  handleSubmitPromise: promiseSubmitMission,
  getOneRecordPromise: promiseGetMissionById,
  schema: {
    header: {},
    body: {
      validate_fields: {
        technical_operation_id: {
          title: 'Технологическая операция',
          type: 'valueOfArray',
          required: true,
        },
        structure_id: {
          title: 'Подразделение',
          type: 'valueOfArray',
          required: false,
        },
        passes_count: {
          title: 'Количество циклов',
          type: 'number',
          required: true,
          integer: true,
          max: 10,
          dependencies: [
            (value, { order_id }, reduxState) => {
              const dependeceTechnicalOperation = getMissionsState(reduxState).missionData.dependeceTechnicalOperation;

              if (value) {
                if (Number(value) < 1) {
                  return '"Количество циклов" должно быть больше 0';
                }

                if (order_id && Number(value) > get(dependeceTechnicalOperation, 'num_exec', 0)) {
                  return 'Поле "Количество циклов" должно быть не больше количества выполнений поручения (факсограммы)"';
                }
              }
              return '';
            },
          ],
        },
        car_ids: {
          title: 'Транспортное средство',
          type: 'multiValueOfArray',
          required: true,
          dependencies: [
            (value, { for_column }) => {
              if (!value || value.length === 0) {
                return 'Поле "Транспортное средство" должно быть заполнено';
              }

              if (for_column && Array.isArray(value) && value.length === 1) {
                return 'Для создания задания на колонну должно быть выбрано более одного ТС';
              }

              return '';
            },
          ],
        },
        for_column: {
          title: 'Создать задания на колонну',
          type: 'boolean',
        },
        mission_source_id: {
          title: 'Источник получения задания',
          type: 'valueOfArray',
          required: true,
        },
        date_start: {
          title: 'Время выполнения, с',
          type: 'datetime',
          required: true,
          dependencies: [
            (value, { waybill_id, order_id }, reduxState) => {
              const dependeceTechnicalOperation = getMissionsState(reduxState).missionData.dependeceTechnicalOperation;
              const dependeceOrder = getMissionsState(reduxState).missionData.dependeceOrder;
              const waybillData = getMissionsState(reduxState).missionData.waybillData;

              if (value) {
                if (order_id) {
                  const order_operation_date_from = get(
                    dependeceTechnicalOperation,
                    'date_from',
                    null,
                  );
                  const order_operation_date_to = get(
                    dependeceTechnicalOperation,
                    'date_to',
                    null,
                  );

                  const order_date = get(
                    dependeceOrder,
                    'order_date',
                    null,
                  );
                  const order_date_to = get(
                    dependeceOrder,
                    'order_date_to',
                    null,
                  );

                  const checkOrderDateFrom = order_operation_date_from || order_date;
                  const checkOrderDateTo = order_operation_date_to || order_date_to;

                  if (diffDates(value, checkOrderDateFrom) < 0 || diffDates(value, checkOrderDateTo) > 0) {
                    return 'Дата не должна выходить за пределы действия поручения (факсограммы)';
                  }
                }

                if (waybill_id) {
                  const waybill_plan_departure_date = get(
                    waybillData,
                    'plan_departure_date',
                    null,
                  );
                  const waybill_plan_arrival_date = get(
                    waybillData,
                    'plan_arrival_date',
                    null,
                  );

                  const waybill_fact_departure_date = get(
                    waybillData,
                    'fact_departure_date',
                    null,
                  );
                  const waybill_fact_arrival_date = get(
                    waybillData,
                    'fact_arrival_date',
                    null,
                  );

                  const checkWaybillDateFrom = waybill_fact_departure_date || waybill_plan_departure_date;
                  const checkWaybillDateTo = waybill_fact_arrival_date || waybill_plan_arrival_date;

                  if (diffDates(value, checkWaybillDateFrom) < 0 || diffDates(value, checkWaybillDateTo) > 0) {
                    return 'Дата не должна выходить за пределы путевого листа';
                  }
                }
              }
              return '';
            },
          ],
        },
        date_end: {
          title: 'Время выполнения, по',
          type: 'datetime',
          required: true,

          dependencies: [
            (value, { date_start, order_id, waybill_id, object_type_name, is_cleaning_norm }, reduxState) => {
              const dependeceTechnicalOperation = getMissionsState(reduxState).missionData.dependeceTechnicalOperation;
              const dependeceOrder = getMissionsState(reduxState).missionData.dependeceOrder;
              const waybillData = getMissionsState(reduxState).missionData.waybillData;

              if (value) {
                if (date_start && diffDates(date_start, value) >= 0) {
                  return `"Время выполнения, по" должно быть больше "Время выполнения, с"`;
                }

                if (order_id) {
                  const order_operation_date_from = get(
                    dependeceTechnicalOperation,
                    'date_from',
                    null,
                  );
                  const order_operation_date_to = get(
                    dependeceTechnicalOperation,
                    'date_to',
                    null,
                  );

                  const order_date = get(
                    dependeceOrder,
                    'order_date',
                    null,
                  );
                  const order_date_to = get(
                    dependeceOrder,
                    'order_date_to',
                    null,
                  );

                  const checkDateFrom = order_operation_date_from || order_date;
                  const checkDateTo = order_operation_date_to || order_date_to;

                  if (diffDates(value, checkDateTo) > 0 || diffDates(value, checkDateFrom) < 0) {
                    return 'Дата не должна выходить за пределы действия поручения (факсограммы)';
                  }
                }
                if (waybill_id) {
                  const waybill_plan_departure_date = get(
                    waybillData,
                    'plan_departure_date',
                    null,
                  );
                  const waybill_plan_arrival_date = get(
                    waybillData,
                    'plan_arrival_date',
                    null,
                  );

                  const waybill_fact_departure_date = get(
                    waybillData,
                    'fact_departure_date',
                    null,
                  );
                  const waybill_fact_arrival_date = get(
                    waybillData,
                    'fact_arrival_date',
                    null,
                  );

                  const checkWaybillDateFrom = waybill_fact_departure_date || waybill_plan_departure_date;
                  const checkWaybillDateTo = waybill_fact_arrival_date || waybill_plan_arrival_date;

                  if (diffDates(value, checkWaybillDateTo) > 0 || diffDates(value, checkWaybillDateFrom) < 0) {
                    return 'Дата не должна выходить за пределы путевого листа';
                  }
                }

                if (is_cleaning_norm && date_start && object_type_name) {
                  const time = get(routeTypesByTitle, `${object_type_name}.time`, null);

                  if (time && diffDates(value, date_start, 'hours') > time) {
                    return `Время выполнения задания для ${object_type_name} должно составлять не более ${time} часов`;
                  }
                }
              }
              return '';
            },
          ],
        },
        municipal_facility_id: {
          title: 'Элемент',
          type: 'valueOfArray',
          required: true,
        },
        route_id: {
          title: 'Маршрут',
          type: 'valueOfArray',
          required: true,
        },
      },
    },
  },
  user_structure_on_new: true,
  getDefaultElement: (reduxState) => ({
    author: '',
    can_be_closed: false,
    can_be_closed_wb: false,
    can_edit_car_and_route: false,
    car_gov_number: '',
    car_gov_numbers: [],
    car_id: null,
    car_ids: [],
    car_model_name: '',
    car_model_names: [],
    car_special_model_name: '',
    car_special_model_names: [],
    car_type_id: null,
    car_type_ids: [],
    car_type_name: '',
    car_type_names: [],
    column_id: null,
    comment: '',
    current_percentage: null,
    date_end: createValidDateTime(getTomorrow9am()),
    date_start: createValidDateTime(getDateWithMoscowTz()),
    description: '',
    id: null,
    is_archive: false,
    is_new: true,
    is_valid_to_order_operation: null,
    for_column: false,
    mission_source_id: 3,
    mission_source_name: '',
    mission_source_text: '',
    municipal_facility_id: null,
    municipal_facility_name: '',
    name: '',
    norm_id: null,
    norm_ids: [],
    norm_text: '',
    number: null,
    object_type_id: null,
    object_type_name: '',
    operation_num_execution: null,
    faxogramm_id: null,
    order_id: null,
    order_number: null,
    order_operation_id: null,
    order_status: '',
    passes_count: 1,
    reason_id: null,
    reason_name: '',
    request_id: null,
    request_number: '',
    route_id: null,
    route_type: '',
    route_name: '',
    status: '',
    status_name: '',
    structure_id: null,
    structure_name: '',
    technical_operation_id: null,
    technical_operation_name: '',
    type_id: null,
    type_name: '',
    waybill_id: null,
    waybill_number: null,
  }),
};
