import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from './permissions';
import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

export const registryKey = 'programRegistryRegistry';

export const getToConfig = (): TypeConfigData<ProgramRegistry> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'repair/program_registry',
      },
      removeOneData: {
        entity: 'repair/program_version',
      },
    },
    registryKey,
    header: {
      title: 'Планирование ремонтных работ',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.remove,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'repair_type_id',
          labelKey: 'repair_type_name',
          title: 'Тип ремонта',
          type: 'multiselect',
        },
        {
          valueKey: 'state_program_id',
          labelKey: 'state_program_name',
          title: 'Гос. программа',
          type: 'multiselect',
        },
        {
          valueKey: 'name',
          title: 'Наименование программы',
          type: 'multiselect',
        },
        {
          valueKey: 'status',
          labelKey: 'status_name',
          title: 'Статус',
          type: 'multiselect',
        },
        {
          valueKey: 'plan_date_start',
          title: 'План. начало',
          type: 'advanced-date',
        },
        {
          valueKey: 'plan_date_end',
          title: 'План. завершение',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_start',
          title: 'Факт. начало',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_end',
          title: 'Факт. завершение',
          type: 'advanced-date',
        },
        {
          valueKey: 'percent',
          title: 'Процент выполнения',
          type: 'multiselect',
        },
        {
          valueKey: 'objects_count',
          title: 'Количество ОДХ/ДТ',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions,
      data: {
        uniqKey: 'version_id',
        fixedWidth: true,
        uniqKeyForParams: 'program_registry_registry_id',
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
            key: 'repair_type_name',
            title: 'Тип ремонта',
            width: 125,
          },
          {
            key: 'state_program_name',
            title: 'Гос. программа',
            width: 150,
          },
          {
            key: 'name',
            title: 'Наименование программы',
            width: 225,
          },
          {
            key: 'status_name',
            title: 'Статус',
            width: 100,
          },
          {
            key: 'plan_date_start',
            title: 'План. начало',
            format: 'date',
            width: 150,
          },
          {
            key: 'plan_date_end',
            title: 'План. завершение',
            format: 'date',
            width: 175,
          },
          {
            key: 'fact_date_start',
            title: 'Факт. начало',
            format: 'date',
            width: 150,
          },
          {
            key: 'fact_date_end',
            title: 'Факт. завершение',
            format: 'date',
            width: 175,
          },
          {
            key: 'percent',
            title: 'Процент выполнения',
            width: 200,
          },
          {
            key: 'objects_count',
            title: 'Количество ОДХ/ДТ',
            width: 200,
          },
        ],
      },
    },
  };
};
