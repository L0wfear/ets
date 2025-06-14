import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import waybillPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { WaybillRegistryRow } from 'redux-main/reducers/modules/waybill/@types';
import { WAYBILL_STATUSES } from 'constants/statuses';
import { WaybillCarService } from 'api/Services';

export const registryWaybillKey = 'Waybills';

export const config: TypeConfigData<WaybillRegistryRow> = {
  Service: {
    getRegistryData: {
      entity: 'waybill',
      typeAns: 'result',
      userServerFilters: true,
    },
    removeOneData: {
      entity: 'waybill',
      uniqKeyLikeQueryString: true,
    },
    getBlobData: {
      entity: 'waybill',
      payload: {
        format: 'xls',
      },
    },
  },
  registryKey: registryWaybillKey,
  header: {
    title: 'Журнал путевых листов',
    buttons: [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.create,
      buttonsTypes.read,
      buttonsTypes.remove,
      buttonsTypes.waybill_print,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'number',
        title: 'Номер ПЛ',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'car_id',
        title: 'Рег. номер ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: WaybillCarService._path,
          groupName: WaybillCarService._path,
          valueKey: 'asuods_id',
          labelKey: 'gov_number',
        },
      },
      {
        valueKey: 'date_create',
        title: 'Дата создания',
        type: 'advanced-date',
      },
      {
        valueKey: 'closing_date',
        title: 'Дата закрытия',
        type: 'advanced-date',
      },
      {
        valueKey: 'status',
        title: 'Статус ПЛ',
        type: 'multiselect',
        options: Object.keys(WAYBILL_STATUSES).map((key) => ({
          label: WAYBILL_STATUSES[key],
          value: key,
        })),
      },
      {
        valueKey: 'garage_number',
        title: 'Гаражный номер',
        type: 'multiselect',
        getRegistryData: {
          entity: WaybillCarService._path,
          groupName: WaybillCarService._path,
          valueKey: 'garage_number',
          labelKey: 'garage_number',
        },
      },
      {
        valueKey: 'driver_id',
        title: 'Водитель',
        type: 'multiselect',
        getRegistryData: {
          entity: 'driver',
          typeAns: 'result',
          valueKey: 'id',
          format: 'short_employee_name',
        },
      },
      {
        valueKey: 'all_missions_status',
        title: 'Статус заданий',
        type: 'multiselect',
        options: [
          { value: 'all_completed', label: 'Все задания завершены' },
          { value: 'not_all_completed', label: 'Есть незавершенные задания' },
          { value: 'not_mission', label: 'Нет прикреплённых заданий' },
        ],
      },
      {
        valueKey: 'car_model_id',
        title: 'Марка шасси',
        type: 'multiselect',
        getRegistryData: {
          entity: 'car_actual',
          groupName: 'car_actual',
          valueKey: 'model_id',
          labelKey: 'model_name',
        },
      },
      {
        valueKey: 'car_special_model_id',
        title: 'Модель ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: 'car_actual',
          groupName: 'car_actual',
          valueKey: 'special_model_id',
          labelKey: 'special_model_name',
        },
      },
      {
        valueKey: 'work_mode_id',
        title: 'Режим работы',
        type: 'multiselect',
        getRegistryData: {
          entity: 'work_mode',
          valueKey: 'id',
          format: 'work_mode_label', // `${name} (${start_time_text} - ${end_time_text})`,
        },
      },
      {
        valueKey: 'plan_departure_date',
        title: 'Выезд план',
        type: 'advanced-date',
      },
      {
        valueKey: 'fact_departure_date',
        title: 'Выезд факт',
        type: 'advanced-date',
      },
      {
        valueKey: 'plan_arrival_date',
        title: 'Возвращение план',
        type: 'advanced-date',
      },
      {
        valueKey: 'fact_arrival_date',
        title: 'Возвращение факт',
        type: 'advanced-date',
      },
      {
        valueKey: 'created_by_employee_id',
        title: 'Создан',
        type: 'multiselect',
        getRegistryData: {
          entity: 'employee',
          groupName: 'employee',
          valueKey: 'id',
          format: 'short_employee_name',
        },
      },
      {
        valueKey: 'activated_by_employee_id',
        title: 'Выдан',
        type: 'multiselect',
        getRegistryData: {
          entity: 'employee',
          groupName: 'employee',
          valueKey: 'id',
          format: 'short_employee_name',
        },
      },
      {
        valueKey: 'closed_by_employee_id',
        title: 'Закрыт',
        type: 'multiselect',
        getRegistryData: {
          entity: 'employee',
          groupName: 'employee',
          valueKey: 'id',
          format: 'short_employee_name',
        },
      },
      {
        valueKey: 'driver_personnel_number',
        title: 'Табельный номер',
        type: 'multiselect',
        getRegistryData: {
          entity: 'employee_in_waybill',
          typeAns: 'result',
          valueKey: 'personnel_number',
        },
      },
      {
        valueKey: 'odometr_start',
        title: 'Одометр. Выезд',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'odometr_end',
        title: 'Одометр Возврат',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'motohours_start',
        title: 'Моточасы. Выезд',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'motohours_end',
        title: 'Моточасы. Возврат',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'motohours_equip_start',
        title: 'Моточасы обор. Выезд',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'motohours_equip_end',
        title: 'Моточасы обор. Возврат',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'fuel_start',
        title: 'Топливо. Выезд',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'fuel_given',
        title: 'Топливо. Выдано, л',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'fact_fuel_end',
        title: 'Топливо. Возврат',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'equipment_fuel_given',
        title: 'Топливо обор. Выдано',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'is_edited_start',
        title: 'Изменение показателей выезда',
        type: 'multiselect',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: '-' },
        ],
      },
      {
        valueKey: 'structure_id',
        labelKey: 'structure_name',
        type: 'multiselect',
        title: [
          {
            displayIf: displayIfContant.lenghtStructureMoreOne,
            title: 'Подразделение',
          },
        ],
        getRegistryData: {
          entity: 'company_structure',
          payload: {
            linear: true,
          },
          typeAns: 'result',
          valueKey: 'id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'failed_medical_stat_types',
        title: 'Непройденные мед. осмотры',
        type: 'advanced-select-like',
        options: [
          { value: '%before%', label: 'предрейсовый' },
          { value: '%after%', label: 'послерейсовый' },
          { value: '%line%', label: 'внеплановый' },
        ],
      },
      {
        valueKey: 'refill_type_ids',
        title: 'Способ заправки',
        type: 'multiselect',
        getRegistryData: {
          entity: 'refill_type',
          valueKey: 'id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'fuel_card_ids',
        title: 'Топливная карта',
        type: 'multiselect',
        getRegistryData: {
          entity: 'fuel_cards',
          valueKey: 'id',
          labelKey: 'number',
        },
      },
      {
        valueKey: 'okrug_id',
        labelKey: 'okrug_name',
        title: 'Округ',
        type: 'multiselect',
        makeOptionsFromSessionData: {
          groupName: 'okrugs',
          valueKey: 'id',
          labelKey: 'name',
        }
      },
      {
        valueKey: 'company_id',
        labelKey: 'company_name',
        title: 'Организация',
        type: 'multiselect',
        makeOptionsFromSessionData: {
          groupName: 'companies',
          valueKey: 'asuods_id',
          labelKey: 'name',
        }
      },
    ],
  },
  list: {
    permissions: waybillPermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'waybill_id',
    },
    meta: {
      fields: [
        {
          key: 'checkbox',
        },
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'okrug_name',
          title: 'Округ',
          width: 150,
        },
        {
          key: 'company_name',
          title: 'Организация',
          width: 200,
        },
        {
          key: 'number',
          title: 'Номер',
          width: 100,
        },
        {
          key: 'status_text',
          title: 'Статус ПЛ',
          sortBy: 'status',
          width: 125,
        },
        {
          key: 'all_missions_status',
          title: 'Статус заданий',
          format: 'waybill_all_missions_status',
          width: 200,
        },
        {
          key: 'date_create',
          title: 'Дата создания',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'closing_date',
          title: 'Дата закрытия',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'driver_fio',
          title: 'Водитель',
          width: 150,
        },
        {
          key: 'driver_personnel_number',
          title: 'Табельный номер',
          width: 150,
        },
        {
          key: 'gov_number',
          title: 'Рег. номер ТС',
          width: 150,
        },
        {
          key: 'car_special_model_name',
          title: 'Модель ТС',
          width: 150,
        },
        {
          key: 'car_model_name',
          title: 'Марка шасси',
          width: 150,
        },
        {
          key: 'garage_number',
          title: 'Гаражный номер',
          width: 175,
        },
        {
          key: 'work_mode_name',
          title: 'Режим работы',
          width: 150,
        },
        {
          key: 'plan_departure_date',
          title: 'Выезд план',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'fact_departure_date',
          title: 'Выезд факт',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'plan_arrival_date',
          title: 'Возвращение план',
          format: 'datetime',
          width: 175,
        },
        {
          key: 'fact_arrival_date',
          title: 'Возвращение факт',
          format: 'datetime',
          width: 200,
        },
        {
          key: 'created_by_employee_name',
          title: 'Создан',
          width: 150,
        },
        {
          key: 'activated_by_employee_name',
          title: 'Выдан',
          width: 150,
        },
        {
          key: 'closed_by_employee_name',
          title: 'Закрыт',
          width: 150,
        },
        {
          key: 'odometr_start',
          title: 'Одометр. Выезд',
          width: 175,
        },
        {
          key: 'odometr_end',
          title: 'Одометр Возврат',
          width: 175,
        },
        {
          key: 'track_length_km',
          title: 'Пройдено по Глонасс, км',
          width: 200,
          sortable: false,
        },
        {
          key: 'motohours_start',
          title: 'Моточасы. Выезд',
          width: 175,
        },
        {
          key: 'motohours_end',
          title: 'Моточасы. Возврат',
          width: 200,
        },
        {
          key: 'motohours_equip_start',
          title: 'Моточасы обор. Выезд',
          width: 200,
        },
        {
          key: 'motohours_equip_end',
          title: 'Моточасы обор. Возврат',
          width: 200,
        },
        {
          key: 'fuel_start',
          title: 'Топливо. Выезд',
          width: 200,
        },
        {
          key: 'fuel_given',
          title: 'Топливо. Выдано, л',
          width: 200,
        },
        {
          key: 'fact_fuel_end',
          title: 'Топливо. Возврат',
          width: 200,
        },
        {
          key: 'equipment_fuel_given',
          title: 'Топливо обор. Выдано',
          width: 250,
        },
        {
          key: 'sensor_start_value',
          title: 'Топливо. Выезд по ДУТ, л',
          width: 250,
          sortable: false,
          format: 'toFixed3',
        },
        {
          key: 'sensor_finish_value',
          title: 'Топливо. Возврат по ДУТ, л',
          width: 250,
          sortable: false,
          format: 'toFixed3',
        },
        {
          key: 'sensor_consumption',
          title: 'Топливо. Расход по ДУТ, л',
          width: 250,
          sortable: false,
          format: 'toFixed3',
        },
        {
          key: 'sensor_refill',
          title: 'Топливо. Заправка по ДУТ, л',
          width: 250,
          sortable: false,
          format: 'toFixed3',
        },
        {
          key: 'sensor_leak',
          title: 'Топливо. Слив по ДУТ, л',
          width: 250,
          sortable: false,
          format: 'toFixed3',
        },
        {
          key: 'is_edited_start',
          title: 'Изменение показателей выезда',
          width: 250,
          valueForBoolean: 'Да',
        },
        {
          key: 'structure_name',
          title: [
            {
              displayIf: displayIfContant.lenghtStructureMoreOne,
              title: 'Подразделение',
            },
          ],
          dashIfEmpty: true,
          width: 150,
        },
        {
          key: 'comment',
          title: 'Комментарий',
          width: 150,
        },
        {
          key: 'showCarOnMap',
          title: 'Показать на карте',
        },
        {
          key: 'failed_medical_stat_types',
          title: 'Непройденные мед. осмотры',
          width: 300,
        },
      ],
    },
    processed: {
      sort: {
        field: 'number',
        reverse: true,
      },
    },
  },
};
