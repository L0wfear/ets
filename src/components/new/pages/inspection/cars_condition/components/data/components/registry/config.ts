import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { InspectionPayload } from 'components/new/pages/inspection/common_components/data/@types/InspectionData';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'inspectionCarsCondition';

export const getInspectionCarsConditionDataRegistryConfig = (payload: InspectionPayload, searchState: any): TypeConfigData<InspectCarsCondition> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspection/cars_condition',
        payload: {
          ...payload
        },
      },
      getBlobData: {
        entity: 'inspection/cars_condition/export',
      },
    },
    registryKey,
    header: {
      title: 'Журнал проверок',
      buttons: [
        buttonsTypes.inspect_show_acts,
        buttonsTypes.inspect_get_acts,
        buttonsTypes.filter,
        buttonsTypes.read,
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_id',
          labelKey: 'okrug_name',
          type: 'multiselect',
          title: 'Округ',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_short_name',
          type: 'multiselect',
          title: 'Организация',
        },
        {
          valueKey: 'date_start',
          type: 'advanced-date',
          title: 'Дата начала проверки',
        },
        {
          valueKey: 'date_end',
          type: 'advanced-date',
          title: 'Дата окончания проверки',
        },
        {
          valueKey: 'status',
          labelKey: 'status_text',
          type: 'multiselect',
          title: 'Статус проверки',
        },
        {
          valueKey: 'monitoring_kind',
          labelKey: 'monitoring_kind_text',
          type: 'multiselect',
          title: 'Вид мониторинга',
        },
        {
          valueKey: 'checks_period',
          labelKey: 'checks_period_text',
          type: 'multiselect',
          title: 'Период проверки',
        },
        {
          valueKey: 'checks_type',
          labelKey: 'checks_type_text',
          type: 'multiselect',
          title: 'Тип проверки',
        },
        {
          valueKey: 'cars_cnt',
          type: 'advanced-number',
          title: 'Количество ТС на балансе',
          step: 1,
        },
        {
          valueKey: 'staff_drivers',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Кол-во водителей по штатному расписанию, чел.',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'staff_mechanics',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Кол-во механизаторов по штатному расписанию, чел.',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'list_drivers',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Списочное кол-во водителей , чел.',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'list_mechanics',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Списочное кол-во механизаторов , чел.',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'staffing_drivers',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Укомплектованность водителей, %',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'staffing_mechanics',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Укомплектованность механизаторов, %',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'maintenance',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Кол-во ТС на техническом обслуживании',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'repair',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Кол-во ТС на ремонте/в ожидании ремонта',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'storage',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Кол-во ТС на консервации (хранении)',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'not_used',
          type: 'advanced-number',
          title: [
            {
              displayIf: displayIfContant.carUse,
              title: 'Не используется ТС',
            },
          ],
          step: 1,
        },
        {
          valueKey: 'open_employee_fio',
          title: 'Открыта',
          type: 'multiselect',
        },
        {
          valueKey: 'close_employee_fio',
          title: 'Завершена',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions,
      data: {
        uniqKey: 'id',
        uniqKeyForParams: 'id', // @todo
        fixedWidth: true,
      },
      processed: {
        filterValues: {},
        sort: {
          field: 'status_text',
          reverse: true,
        },
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
            width: 200,
          },
          {
            key: 'company_short_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'date_start',
            title: 'Дата начала проверки',
            format: 'date',
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Дата окончания проверки',
            format: 'date',
            width: 250,
          },
          {
            key: 'monitoring_kind_text',
            title: 'Вид мониторинга',
            width: 200,
          },
          {
            key: 'status_text',
            title: 'Статус проверки',
            width: 200,
          },
          {
            key: 'checks_period_text',
            title: 'Период проверки',
            width: 150,
            dashIfEmpty: true,
          },
          {
            key: 'checks_type_text',
            title: 'Тип проверки',
            width: 150,
          },
          {
            key: 'cars_cnt',
            title: 'Количество ТС на балансе',
            width: 250,
          },
          {
            key: 'staff_drivers',
            title: 'Кол-во водителей по штатному расписанию, чел.',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'staff_mechanics',
            title: 'Кол-во механизаторов по штатному расписанию, чел.',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'list_drivers',
            title: 'Списочное кол-во водителей , чел.',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'list_mechanics',
            title: 'Списочное кол-во механизаторов , чел.',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'staffing_drivers',
            title: 'Укомплектованность водителей, %',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'staffing_mechanics',
            title: 'Укомплектованность механизаторов, %',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'maintenance',
            title: 'Кол-во ТС на техническом обслуживании',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'repair',
            title: 'Кол-во ТС на ремонте/в ожидании ремонта',
            hidden:  searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'storage',
            title: 'Кол-во ТС на консервации (хранении)',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'not_used',
            title: 'Не используется ТС',
            hidden: searchState.monitoringKind !== 'car_use',
          },
          {
            key: 'open_employee_fio',
            title: 'Открыта',
            width: 200,
          },
          {
            key: 'close_employee_fio',
            title: 'Завершена',
            width: 200,
          },
        ],
      },
    },
  };
};
