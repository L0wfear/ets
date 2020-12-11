import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/inspection/cars_condition/_config_data/permissions';
import { InspectCarsCondition } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'inspectionCarsCondition';

export const getInspectionCarsConditionDataRegistryConfig = (searchState: any): TypeConfigData<InspectCarsCondition> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspection/cars_condition',
        payload: {
          company_id: searchState.companyId,
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
          },
          {
            key: 'staff_mechanics',
            title: 'Кол-во механизаторов по штатному расписанию, чел.',
          },
          {
            key: 'list_drivers',
            title: 'Списочное кол-во водителей , чел.',
          },
          {
            key: 'list_mechanics',
            title: 'Списочное кол-во механизаторов , чел.',
          },
          {
            key: 'staffing_drivers',
            title: 'Укомплектованность водителей, %',
          },
          {
            key: 'staffing_mechanics',
            title: 'Укомплектованность механизаторов, %',
          },
          {
            key: 'maintenance',
            title: 'Кол-во ТС на техническом обслуживании',
          },
          {
            key: 'repair',
            title: 'Кол-во ТС на ремонте/в ожидании ремонта',
          },
          {
            key: 'storage',
            title: 'Кол-во ТС на консервации (хранении)',
          },
          {
            key: 'not_used',
            title: 'Не используется ТС',
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
