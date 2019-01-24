import { GeozoneMspService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';

export const registryKey = 'MspList';

export const config: TypeConfigData<Msp> = {
  Service: GeozoneMspService,
  registryKey,
  header: {
    title: 'Мобильные снегоплавильные пункты',
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
        title: 'Полное наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'shortname',
        title: 'Краткое наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'address',
        title: 'Адрес',
        type: 'multiselect',
      },
      {
        valueKey: 'productivity',
        title: 'Производительность (куб. м в сутки)',
        type: 'advanced-number',
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
          title: 'Полное наименование',
        },
        {
          key: 'shortname',
          title: 'Краткое наименование',
          width: 300,
        },
        {
          key: 'address',
          title: 'Адрес',
          width: 400,
        },
        {
          key: 'productivity',
          title: 'Производительность (куб. м в сутки)',
          toFixed: 2,
          width: 200,
        },
      ],
    },
  },
};
