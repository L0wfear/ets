import { GeozoneBridgesService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';

export const registryKey = 'BridgesList';

export const config: TypeConfigData<Bridges> = {
  Service: GeozoneBridgesService,
  registryKey,
  header: {
    title: 'Мосты',
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
        valueKey: 'district_text',
        title: 'Район',
        type: 'multiselect',
      },
      {
        valueKey: 'crossing',
        title: 'Пересечение',
        type: 'multiselect',
      },
      {
        valueKey: 'year_of_commissioning',
        title: 'Год ввода в эксплуатацию',
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
        },
        {
          key: 'district_text',
          title: 'Район',
        },
        {
          key: 'location',
          title: 'Местоположение объекта',
        },
        {
          key: 'crossing',
          title: 'Пересечение',
        },
        {
          key: 'year_of_commissioning',
          title: 'Год ввода в эксплуатацию',
        },
      ],
    },
  },
};
