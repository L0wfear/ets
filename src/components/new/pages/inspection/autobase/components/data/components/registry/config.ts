import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { InspectionAutobaseDataRegistryProps } from './@types/InspectionAutobaseDataRegistry';
import { getNumberValueFromSerch } from 'components/new/utils/hooks/useStateUtils';

export const registryKey = 'inspectAutobase';

export const getInspectionAutobaseDataRegistryConfig = (props: InspectionAutobaseDataRegistryProps): TypeConfigData<InspectAutobase> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'inspect/registry',
        payload: {
          base_id: getNumberValueFromSerch(props.searchState.carpoolId),
          type: 'autobase',
        },
      },
      getBlobData: {
        entity: 'inspect/registry',
        payload: {
          base_id: getNumberValueFromSerch(props.searchState.carpoolId),
          type: 'autobase',
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Журнал испекций',
      buttons: [
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
          title: 'Дата начала испекции',
        },
        {
          valueKey: 'date_end',
          type: 'advanced-date',
          title: 'Дата окончания испекции',
        },
        {
          valueKey: 'status_text',
          type: 'multiselect',
          title: 'Статус проверки',
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
      ],
    },
    list: {
      permissions,
      data: {
        uniqKey: 'id',
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
            key: 'date_start',
            title: 'Дата начала испекции',
            format: 'date',
            width: 250,
          },
          {
            key: 'date_end',
            title: 'Дата окончания испекции',
            format: 'date',
            width: 250,
          },
          {
            key: 'status_text',
            title: 'Статус проверки',
            width: 200,
          },
          {
            key: 'company_name',
            title: 'Организация',
            width: 500,
          },
          {
            key: 'base_address',
            title: 'Адрес',
            width: 200,
          },
        ],
      },
    },
  };
};
