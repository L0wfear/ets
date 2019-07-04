import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/inspection/pgm_base/_config_data/permissions';
import { InspectPgmBase } from 'redux-main/reducers/modules/inspect/pgm_base/@types/inspect_pgm_base';

export const registryKey = 'inspectionPgmBase';

export const getInspectionPgmBaseDataRegistryConfig = ({ pgmBaseId }: any): TypeConfigData<InspectPgmBase> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspect/registry',
        payload: {
          base_id: pgmBaseId,
          type: 'pgm_base',
        },
      },
      getBlobData: {
        entity: 'inspect/registry',
        payload: {
          base_id: pgmBaseId,
          type: 'pgm_base',
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Журнал проверок',
      buttons: [
        buttonsTypes.inspect_show_acts,
        buttonsTypes.filter,
        buttonsTypes.read,
        buttonsTypes.export,
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
          valueKey: 'status_text',
          type: 'multiselect',
          title: 'Статус проверки',
        },
        {
          valueKey: 'okrug_name',
          type: 'multiselect',
          title: 'Округ',
        },
        {
          valueKey: 'company_name',
          type: 'multiselect',
          title: 'Организация',
        },
        {
          valueKey: 'base_address',
          type: 'multiselect',
          title: 'Адрес',
        },
        {
          valueKey: 'base_type',
          type: 'multiselect',
          title: 'Тип базы',
        },
        {
          valueKey: 'capacity_cnt',
          type: 'multiselect',
          title: 'Количество емкостей',
        },
        {
          valueKey: 'volume_capacity_sum',
          type: 'multiselect',
          title: 'Суммарная вместимость',
        },
        {
          valueKey: 'pgm_volume_sum',
          type: 'multiselect',
          title: 'Наличие ПГМ в емкостях',
        },
      ],
    },
    list: {
      permissions,
      data: {
        uniqKey: 'id',
        uniqKeyForParams: 'id', // todo переписать
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
            key: 'status_text',
            title: 'Статус проверки',
            width: 300,
          },
          {
            key: 'okrug_name',
            title: 'Округ',
          },
          {
            key: 'company_name',
            title: 'Организация',
          },
          {
            key: 'base_address',
            title: 'Адрес',
            width: 200,
          },
          {
            key: 'base_type',
            title: 'Тип базы',
            width: 200,
          },
          {
            key: 'capacity_cnt',
            title: 'Количество емкостей',
            width: 200,
          },
          {
            key: 'volume_capacity_sum',
            title: 'Суммарная вместимость',
            width: 200,
          },
          {
            key: 'pgm_volume_sum',
            title: 'Наличие ПГМ в емкостях',
            format: 'boolean',
            width: 200,
          },
        ],
      },
    },
  };
};
