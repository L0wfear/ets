import { GeozoneCarpoolService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/carpool/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

export const registryKey = 'CarpoolList';

export const config: TypeConfigData = {
  Service: GeozoneCarpoolService,
  registryKey,
  header: {
    title: 'Автобазы',
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
        valueKey: 'address',
        title: 'Адрес',
        type: 'multiselect',
      },
      {
        valueKey: 'is_main',
        title: 'Основная автобаза',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_INT,
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
          key: 'address',
          title: 'Адрес',
          width: 400,
        },
        {
          key: 'is_main',
          title: 'Основная автобаза',
          boolean: true,
          width: 200,
        },
      ],
    },
  },
};
