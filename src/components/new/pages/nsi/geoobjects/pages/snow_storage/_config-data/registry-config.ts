import { GeozoneSnowStorageService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/snow_storage/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { SnowStorage } from 'redux-main/reducers/modules/geoobject/actions_by_type/snow_storage/@types';

export const registryKey = 'SnowStorageList';

export const config: TypeConfigData<SnowStorage> = {
  Service: GeozoneSnowStorageService,
  registryKey,
  header: {
    title: 'Пункты временного складирования снега',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'company_name',
        title: [
          {
            displayIf: displayIfContant.isKgh,
            title: 'Наименование ГБУ',
          },
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Учреждение',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'name',
        title: 'Наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'address',
        title: 'Адрес',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Наименование ГБУ',
            },
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Учреждение',
            },
          ],
          width: 200,
        },
        {
          key: 'name',
          title: 'Наименование',
          width: 600,
        },
        {
          key: 'address',
          title: 'Адрес',
          width: 600,
        },
      ],
    },
  },
};
