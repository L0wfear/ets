import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/inspection/autobase/_config_data/permissions';
import { InspectAutobase } from 'redux-main/reducers/modules/inspect/autobase/@types/inspect_autobase';
import { InspectionAutobaseDataRegistryProps } from './@types/InspectionAutobaseDataRegistry';
import { makeDataListAfterLoadInitialData } from 'components/new/ui/registry/module/utils/data';

export const registryKey = 'inspectAutobase';

export const getInspectionAutobaseDataRegistryConfig = (props: InspectionAutobaseDataRegistryProps): TypeConfigData<InspectAutobase> => {
  const array = props.inspectAutobaseList;

  return {
    noInitialLoad: true,
    Service: {
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
          title: 'Статус инспекции',
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
        ...makeDataListAfterLoadInitialData({ array }),
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
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Дата окончания испекции',
            format: 'date',
            width: 250,
          },
          {
            key: 'status_text',
            title: 'Статус инспекции',
            width: 300,
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
        ],
      },
    },
  };
};
