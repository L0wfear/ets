import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/bridges/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Bridges } from 'redux-main/reducers/modules/geoobject/actions_by_type/bridges/@types';
import { gormost } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'BridgesList';

export const config: TypeConfigData<Bridges> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${gormost.bridges}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник мостов',
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
      fixedWidth: true,
      uniqKeyForParams: 'bridge_id',
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
          width: 200,
        },
        {
          key: 'district_text',
          title: 'Район',
          width: 150,
        },
        {
          key: 'location',
          title: 'Местоположение объекта',
          width: 300,
        },
        {
          key: 'crossing',
          title: 'Пересечение',
          width: 200,
        },
        {
          key: 'year_of_commissioning',
          title: 'Год ввода в эксплуатацию',
          width: 300,
        },
      ],
    },
  },
};
