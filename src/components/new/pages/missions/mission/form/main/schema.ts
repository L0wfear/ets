import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { PropsMissionForm } from './@types/index.h';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { get } from 'lodash';
import { routeTypesByTitle } from 'constants/route';

export const missionFormSchema: SchemaType<Mission, PropsMissionForm> = {
  properties: {
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
        (value, { order_id }, { dependeceTechnicalOperation }) => {
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
        (value, { waybill_id, order_id }, { dependeceOrder, dependeceTechnicalOperation, waybillData }) => {
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
        (value, { date_start, order_id, waybill_id, object_type_name, is_cleaning_norm }, { dependeceOrder, dependeceTechnicalOperation, waybillData }) => {
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
};
