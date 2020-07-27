import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/geoobjects/pages/msp/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Msp } from 'redux-main/reducers/modules/geoobject/actions_by_type/msp/@types';
import { geoozones } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'MspList';

export const config: TypeConfigData<Msp> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones.msp}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник МСП',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'okrug_name',
        title: [
          {
            title: 'Округ',
            displayIf: displayIfContant.isKgh,
          }
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'company_name',
        title: [
          {
            displayIf: displayIfContant.isKgh || displayIfContant.isOkrug,
            title: 'Организация',
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
        step: 0.01,
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'msp_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'okrug_name',
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          width: 150,
        },
        {
          key: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh || displayIfContant.isOkrug,
              title: 'Организация',
            },
          ],
          width: 200,
        },
        {
          key: 'name',
          title: 'Полное наименование',
          width: 200,
        },
        {
          key: 'shortname',
          title: 'Краткое наименование',
          width: 200,
        },
        {
          key: 'address',
          title: 'Адрес',
          width: 200,
        },
        {
          key: 'productivity',
          title: 'Производительность (куб. м в сутки)',
          format: 'toFixed2',
          width: 300,
        },
      ],
    },
  },
};
