import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { DUTY_MISSION_STATUS_OPTIONS } from 'redux-main/reducers/modules/missions/duty_mission/constants';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import dutyMissionPermissions from '../../duty_mission/_config-data/permissions';

export const registryKey = 'DutyMissionsArchive';

export const config: TypeConfigData<DutyMission> = {
  Service: {
    getRegistryData: {
      entity: 'duty_mission',
      format: 'duty_mission',
      userServerFilters: true,
      payload: {
        is_archive: true,
      },
    },
    removeOneData: {
      entity: 'duty_mission',
      uniqKeyLikeQueryString: true,
    },
    getBlobData: {
      entity: 'duty_mission',
      payload: {
        is_archive: true,
        format: 'xls',
      },
    },
  },
  registryKey,
  header: {
    title: 'Архив наряд-заданий',
    buttons: [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.duty_missions_export,
      buttonsTypes.duty_missions_from_archvie,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'id',
        title: 'ID',
        type: 'advanced-number',
        step: 1,
      },
      {
        valueKey: 'okrug_id',
        title: [
          {
            title: 'Округ',
            displayIf: displayIfContant.isKgh,
          }
        ],
        type: 'multiselect',
        makeOptionsFromSessionData: {
          groupName: 'okrugs',
          valueKey: 'id',
          labelKey: 'name',
        }
      },
      {
        valueKey: 'company_id',
        title: [
          {
            displayIf: displayIfContant.isKgh,
            title: 'Организация',
          },
        ],
        type: 'multiselect',
        makeOptionsFromSessionData: {
          groupName: 'companies',
          valueKey: 'asuods_id',
          labelKey: 'name',
        }
      },
      {
        valueKey: 'status',
        title: 'Статус',
        type: 'multiselect',
        options: DUTY_MISSION_STATUS_OPTIONS,
      },
      {
        valueKey: 'number',
        title: 'Номер',
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
        valueKey: 'plan_date_start',
        title: 'Начало план',
        type: 'advanced-datetime',
      },
      {
        valueKey: 'plan_date_end',
        title: 'Завершение план',
        type: 'advanced-datetime',
      },
      {
        valueKey: 'fact_date_start',
        title: 'Начало факт',
        type: 'advanced-datetime',
      },
      {
        valueKey: 'fact_date_end',
        title: 'Завершение факт',
        type: 'advanced-datetime',
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
        valueKey: 'foreman_id',
        labelKey: 'foreman_fio',
        title: 'Бригадир',
        type: 'multiselect',
        getRegistryData: {
          entity: 'foreman',
          typeAns: 'result',
          valueKey: 'id',
          labelKey: 'fio',
        },
      },
      {
        valueKey: 'comment',
        title: 'Комментарий',
        type: 'advanced-string-like',
      },
      {
        valueKey: 'car_mission_id',
        title: 'Задание на ТС',
        type: 'multiselect',
        getRegistryData: {
          entity: 'duty_mission_car_mission',
          typeAns: 'result',
          valueKey: 'id',
          labelKey: 'car_mission_name',
          payload: {
            for_archive: true,
          },
        },
      },
      {
        valueKey: 'structure_id',
        title: 'Подразделение',
        type: 'multiselect',
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
    permissions: dutyMissionPermissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'duty_mission_id',
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
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          width: 150,
        },
        {
          key: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          width: 150,
        },
        {
          key: 'id',
          title: 'ID',
          width: 100,
        },
        {
          key: 'status_name',
          title: 'Статус',
          width: 100,
        },
        {
          key: 'number',
          title: 'Номер',
          width: 100,
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
          key: 'technical_operation_name',
          title: 'Технологическая операция',
          width: 300,
        },
        {
          key: 'municipal_facility_name',
          title: 'Элемент',
          width: 200,
        },
        {
          key: 'plan_date_start',
          title: 'Начало план',
          format: 'datetime',
          width: 175,
        },
        {
          key: 'plan_date_end',
          title: 'Завершение план',
          format: 'datetime',
          width: 175,
        },
        {
          key: 'fact_date_start',
          title: 'Начало факт',
          format: 'datetime',
          width: 175,
        },
        {
          key: 'fact_date_end',
          title: 'Завершение факт',
          format: 'datetime',
          width: 175,
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
          title: 'Количество выполнений',
          width: 200,
        },
        {
          key: 'foreman_fio',
          title: 'Бригадир',
          width: 200,
        },
        {
          key: 'comment',
          title: 'Комментарий',
          width: 200,
        },
        {
          key: 'car_mission_name',
          title: 'Задание на ТС',
          width: 200,
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
        {
          key: 'author',
          title: 'Открыто, ФИО',
          width: 200,
        },
        {
          key: 'closed_by',
          title: 'Закрыто, ФИО',
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
