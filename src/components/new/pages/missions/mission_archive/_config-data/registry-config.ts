import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import missionPermissions from '../../mission/_config-data/permissions';
import { MISSION_STATUS_LABELS } from 'redux-main/reducers/modules/missions/mission/constants';

export const registryKey = 'MissionArchive';

export const config: TypeConfigData<Mission> = {
  Service: {
    getRegistryData: {
      entity: 'mission',
      format: 'mission',
      userServerFilters: true,
      payload: {
        is_archive: true,
      },
    },
    removeOneData: {
      entity: 'mission',
      uniqKeyLikeQueryString: true,
    },
    getBlobData: {
      entity: 'mission',
      payload: {
        is_archive: true,
        format: 'xls',
      },
    },
  },
  registryKey,
  header: {
    title: 'Архив заданий',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.missions_from_archvie,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'status',
        title: 'Статус',
        type: 'multiselect',
        options: Object.keys(MISSION_STATUS_LABELS).map((key) => ({
          label: MISSION_STATUS_LABELS[key],
          value: key,
        })),
      },
      {
        valueKey: 'number',
        title: 'Номер задания',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'waybill_number',
        title: 'Путевой лист',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'column_id',
        title: 'Номер колонны',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'order_number',
        title: 'Факсограмма №',
        type: 'advanced-string-like',
      },
      {
        valueKey: 'mission_source_id',
        title: 'Источник',
        type: 'multiselect',
        getRegistryData: {
          entity: 'mission_source',
          valueKey: 'id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'date_start',
        title: 'Начало',
        type: 'advanced-date',
      },
      {
        valueKey: 'date_end',
        title: 'Завершение',
        type: 'advanced-date',
      },
      {
        valueKey: 'car_id',
        title: 'Рег. номер ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: 'filters/mission_archive/cars',
          valueKey: 'asuods_id',
          labelKey: 'gov_number',
        },
      },
      {
        valueKey: 'type_id',
        title: 'Тип техники',
        type: 'multiselect',
        getRegistryData: {
          entity: 'filters/mission_archive/cars',
          valueKey: 'type_id',
          labelKey: 'type_name',
        },
      },
      {
        valueKey: 'route_name',
        title: 'Маршрут',
        type: 'advanced-string-like',
      },
      {
        valueKey: 'object_type_id',
        title: 'Тип объекта',
        type: 'multiselect',
        getRegistryData: {
          entity: 'technical_operation_objects',
          valueKey: 'id',
          labelKey: 'short_name',
        },
      },
      {
        valueKey: 'passes_count',
        title: 'Количество циклов',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'technical_operation_id',
        title: 'Технологическая операция',
        type: 'multiselect',
        getRegistryData: {
          entity: 'technical_operation_registry',
          valueKey: 'id',
          labelKey: 'name',
        },
      },
      {
        valueKey: 'municipal_facility_id',
        title: 'Элемент',
        type: 'multiselect',
        getRegistryData: {
          entity: 'cleaning/municipal_facility',
          valueKey: 'municipal_facility_id',
          labelKey: 'municipal_facility_name',
        },
      },
      {
        valueKey: 'reason_id',
        title: 'Причина отмены/невыполнения',
        type: 'multiselect',
        getRegistryData: {
          entity: 'mission_cancel_reasons',
          valueKey: 'id',
          labelKey: 'name',
        },
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
        valueKey: 'is_valid_to_order_operation',
        title: 'Не соответствующие поручению',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_INT,
      },
    ],
  },
  list: {
    permissions: missionPermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'mission_id',
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
          key: 'status_name',
          title: 'Статус',
          width: 150,
        },
        {
          key: 'number',
          title: 'Номер задания',
          width: 200,
        },
        {
          key: 'waybill_number',
          title: 'Путевой лист',
          width: 150,
        },
        {
          key: 'column_id',
          title: 'Номер колонны',
          width: 150,
        },
        {
          key: 'current_percentage',
          title: 'Процент выполнения задания (%)',
          sortable: false,
          format: 'floor',
          width: 300,
        },
        {
          key: 'order_number',
          title: 'Факсограмма №',
          width: 150,
        },
        {
          key: 'mission_source_name',
          title: 'Источник',
          width: 150,
        },
        {
          key: 'date_start',
          title: 'Начало',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'date_end',
          title: 'Завершение',
          format: 'datetime',
          width: 150,
        },
        {
          key: 'car_gov_number',
          title: 'Рег. номер ТС',
          width: 150,
        },
        {
          key: 'type_name',
          title: 'Тип техники',
          width: 150,
        },
        {
          key: 'route_name',
          title: 'Маршрут',
          width: 200,
        },
        {
          key: 'object_type_name',
          title: 'Тип объекта',
          width: 150,
        },
        {
          key: 'passes_count',
          title: 'Количество циклов',
          width: 200,
        },
        {
          key: 'technical_operation_name',
          title: 'Технологическая операция',
          width: 250,
        },
        {
          key: 'municipal_facility_name',
          title: 'Элемент',
          width: 200,
        },
        {
          key: 'reason_name',
          title: 'Причина',
          width: 200,
        },
        {
          key: 'comment',
          title: 'Комментарий',
          width: 200,
        },
        {
          key: 'showMissionInfo',
          title: 'Показать на карте',
        },
        {
          key: 'structure_name',
          title: [
            {
              title: 'Подразделение',
              displayIf: displayIfContant.lenghtStructureMoreOne,
            },
          ],
          width: 200,
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
