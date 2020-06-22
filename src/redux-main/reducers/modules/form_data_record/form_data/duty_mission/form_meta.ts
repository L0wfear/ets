import { get } from 'lodash';

import { ConfigFormData } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import { createValidDateTime, getTomorrow9am, diffDates, getToday9am } from 'components/@next/@utils/dates/dates';
import { routeTypesByTitle } from 'constants/route';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import dutyMissionPermissions from 'components/new/pages/missions/duty_mission/_config-data/permissions';
import { promiseGetDutyMissionById, promiseSubmitDutyMission } from 'redux-main/reducers/modules/missions/duty_mission/promise';
import {
  isPermittedEmployeeForDutyMission,
  dutyMissionIsNotAssigned,
} from 'components/new/pages/missions/duty_mission/form/main/utils';
import { getEmployeeState, getMissionsState, getSomeUniqState } from 'redux-main/reducers/selectors';
import { DUTY_MISSION_STATUS, DUTY_MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import memoizeOne from 'memoize-one';
import { getRequiredFieldMessage } from 'components/@next/@utils/getErrorString/getErrorString';
import { defaultCheckConsumableMaterialsNumberValue, validateNormConsumableMaterials } from 'redux-main/reducers/modules/form_data_record/form_data/mission/form_meta';
import * as moment from 'moment';

export const metaDutyMission: ConfigFormData<DutyMission> = {
  uniqField: 'id',
  bsSizeForm: 'large',
  permissions: dutyMissionPermissions,
  handleSubmitPromise: promiseSubmitDutyMission,
  getOneRecordPromise: promiseGetDutyMissionById,
  schema: {
    header: {},
    body: {
      validate_fields: {
        technical_operation_id: {
          title: 'Технологическая операция',
          type: 'valueOfArray',
          required: true,
        },
        fact_date_start: {
          title: 'Фактическая дата начала',
          type: 'datetime',
          required: false,
          dependencies: [
            (value, { plan_date_start, plan_date_end, status }) => {
              const pbs = status && (status === 'assigned' || status === 'complete');
              const validInterval = diffDates(value, plan_date_start) < 0
                                    || diffDates(value, plan_date_end) > 0;

              if (value && pbs && validInterval) {
                return 'Фактическая дата начала не должна выходить за границы плановых дат';
              }
              return '';
            },
            (value, { fact_date_end }) => {
              const pbs = status && (status === 'assigned' || status === 'complete');
              const validInterval = diffDates(value, fact_date_end) <= 0;

              if (value && pbs && validInterval) {
                return 'Фактическая дата начала не должна быть позже фактичекой даты окончания';
              }
              return '';
            },
          ],
        },
        fact_date_end: {
          title: 'Фактическая дата окнчания',
          type: 'datetime',
          required: false,
          dependencies: [
            (value, { plan_date_start, plan_date_end, status }) => {
              const pbs = status && (status === 'assigned' || status === 'complete');
              const validInterval = (
                diffDates(value, plan_date_start) < 0
                || diffDates(value, plan_date_end) > 0
              );

              if (value && pbs && validInterval) {
                return 'Фактическая дата окончания не должна выходить за границы плановых дат';
              }
              return '';
            },
          ],
        },
        plan_date_start: {
          title: 'Плановая дата начала',
          type: 'datetime',
          required: true,
          dependencies: [
            (value, { plan_date_end, id, status }, reduxState) => {
              const dependeceOrder = getMissionsState(reduxState).dutyMissionData.dependeceOrder;
              const dependeceTechnicalOperation = getMissionsState(reduxState).dutyMissionData.dependeceTechnicalOperation;
              const moscowTimeServer = getSomeUniqState(reduxState).moscowTimeServer;

              if (value) {
                if (plan_date_end && diffDates(value, plan_date_end) >= 0) {
                  return 'Дата планируемого начала должна быть раньше даты планируемого окончания';
                }

                if (dependeceOrder && dependeceTechnicalOperation) {
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
                  if (diffDates(value, checkDateFrom) < 0 || diffDates(value, checkDateTo) > 0) {
                    return 'Дата не должна выходить за пределы действия поручения (факсограммы)';
                  }
                }
                
                const minutesDiff = moment(moscowTimeServer.date).diff(moment(value), 'minutes');

                if (!id || dutyMissionIsNotAssigned(status)) {
                  if (moscowTimeServer.date && minutesDiff > 15){
                    return 'Планируемая дата начала не может быть раньше на 15 минут от текущего времени';
                  }
                }

              }
              return '';
            },
          ],
        },
        plan_date_end: {
          title: 'Плановая дата окончания',
          type: 'datetime',
          required: true,
          dependencies: [
            (value, { plan_date_start, object_type_name, is_cleaning_norm, status }, reduxState) => {
              const dependeceOrder = getMissionsState(reduxState).dutyMissionData.dependeceOrder;
              const dependeceTechnicalOperation = getMissionsState(reduxState).dutyMissionData.dependeceTechnicalOperation;

              if (value) {
                if (dependeceOrder && dependeceTechnicalOperation) {
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

                if (is_cleaning_norm && plan_date_start && object_type_name) {
                  const time = get(routeTypesByTitle, `${object_type_name}.time`, null);

                  if (time && diffDates(value, plan_date_start, 'hours') > time && status === 'not_assigned') {
                    return `Время выполнения задания для ${object_type_name} должно составлять не более ${time} часов`;
                  }
                }
              }
              return '';
            },
          ],
        },
        mission_source_id: {
          title: 'Источник получения задания',
          type: 'valueOfArray',
          required: true,
        },
        route_id: {
          title: 'Маршрут',
          type: 'valueOfArray',
          required: true,
        },
        foreman_id: {
          title: 'Бригадир',
          type: 'valueOfArray',
          required: true,
          dependencies: [
            (foreman_id, { structure_id, status, }, reduxState) => {
              const employeeIndex = getEmployeeState(reduxState).employeeIndex;

              if (foreman_id && Object.keys(employeeIndex).length) {
                const isPermitted = isPermittedEmployeeForDutyMission(
                  employeeIndex[foreman_id],
                  structure_id,
                );

                if (!isPermitted && dutyMissionIsNotAssigned(status)) {
                  return 'Поле "Бригадир" должно быть заполнено работающими сотрудниками';
                }
              }

              return '';
            },
          ],
        },
        brigade_employee_id_list: {
          title: 'Бригада',
          type: 'multiValueOfArray',
          required: false,
        },
        municipal_facility_id: {
          title: 'Элемент',
          type: 'valueOfArray',
          required: true,
        },
        brigade_employee_id_list_id: {
          type: 'multiValueOfArray',
          title: 'Бригада.ID',
          dependencies: [
            (value, { structure_id, status, }, reduxState) => {
              const employeeIndex = getEmployeeState(reduxState).employeeIndex;

              if (value.length && Object.keys(employeeIndex).length) {
                const isPermitted = !value.some((employee_id) => (
                  !isPermittedEmployeeForDutyMission(
                    employeeIndex[employee_id],
                    structure_id,
                  )
                ));

                if (!isPermitted && dutyMissionIsNotAssigned(status) ) {
                  return 'Поле "Бригада" должно быть заполнено работающими сотрудниками';
                }
              }

              return '';
            },
          ],
        },
        consumable_materials: {
          title: 'Расходные материалы',
          type: 'multiValueOfArray',
          dependencies: [
            memoizeOne(
              (consumable_materials) => consumable_materials.map((rowData) => ({
                consumable_material_id: !rowData.consumable_material_id && getRequiredFieldMessage('Расходный материал'),
                plan_value: defaultCheckConsumableMaterialsNumberValue(rowData.plan_value, 'Объем работы (план)'),
                fact_value: defaultCheckConsumableMaterialsNumberValue(rowData.fact_value, 'Объем работы (факт)'),
                consumption: defaultCheckConsumableMaterialsNumberValue(rowData.consumption, 'Расход (итого)'),
                norm_value: validateNormConsumableMaterials(rowData.norm_value), 
              })),
            ),
          ],
        },
        passes_count: {
          title: 'Количество выполнений',
          type: 'number',
          required: true,
          maxLength: 2,
          max: 10,
          minNotEqual: 0,
        },
      },
    },
  },
  user_structure_on_new: true,
  getDefaultElement: (reduxState) => ({
    author: '',
    brigade_employee_id_list: [],
    brigade_employee_id_list_id: [],
    brigade_employee_id_list_fio: [],
    brigade_id: null,
    car_mission_id: null,
    car_mission_name: '',
    closed_by: '',
    comment: '',
    fact_date_end: null,
    fact_date_start: null,
    faxogramm_id: null,
    foreman_fio: '',
    foreman_full_fio: '',
    foreman_id: null,
    id: null,
    is_archive: false,
    is_cleaning_norm: false,
    is_valid_to_order_operation: null,
    mission_source_id: 3,
    mission_source_name: '',
    mission_source_text: '',
    municipal_facility_id: null,
    municipal_facility_name: '',
    norm_id: null,
    norm_text: '',
    number: null,
    number_text: null,
    object_type_id: null,
    object_type_name: '',
    operation_num_execution: null,
    order_number: null,
    order_operation_id: null,
    order_status: '',
    plan_date_end: createValidDateTime(getTomorrow9am()),
    plan_date_start: createValidDateTime(getToday9am()), //
    request_id: null,
    request_number: '',
    route_id: null,
    route_type: '',
    route_name: '',
    status: DUTY_MISSION_STATUS.not_assigned,
    status_name: DUTY_MISSION_STATUS_LABELS[DUTY_MISSION_STATUS.not_assigned],
    structure_id: null,
    structure_name: '',
    technical_operation_id: null,
    technical_operation_name: '',
    work_class_id: null,
    passes_count: null,
    is_mission_progress_countable: false,
    consumable_materials: [],
  }),
};
