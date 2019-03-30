import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/ssp/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';
import { Ssp } from 'redux-main/reducers/modules/geoobject/actions_by_type/ssp/@types';
import { geoozones } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'SspList';

export const config: TypeConfigData<Ssp> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones.ssp}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник ССП',
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
      {
        valueKey: 'is_mobile',
        title: 'Мобильность',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_INT,
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'ssp_id',
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
          width: 400,
        },
        {
          key: 'productivity',
          title: 'Производительность (куб. м в сутки)',
          format: 'toFixed2',
          width: 300,
        },
        {
          key: 'is_mobile',
          title: 'Мобильность',
          format: 'boolean',
          width: 150,
        },
      ],
    },
  },
};
