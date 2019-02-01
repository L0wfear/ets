import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';

export const registryKey = 'PgmStoreList';

export const config: TypeConfigData<PgmStore> = {
  Service: {
    getActionPath: ['geoobjectActions', 'actionGetGetPgmStore'],
    getBlobActionPath: ['geoobjectActions', 'actionGetBlobPgmStore'],
  },
  registryKey,
  header: {
    title: 'Справочник пунктов отпуска ПГМ',
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
      {
        valueKey: 'liquid_pgm_volume',
        title: 'Объем жидких ПГМ',
        type: 'advanced-number',
      },
      {
        valueKey: 'solid_pgm_volume',
        title: 'Объем твердых ПГМ',
        type: 'advanced-number',
      },
      {
        valueKey: 'pgm_stores_type_name',
        title: 'Тип ПГМ',
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
          key: 'address',
          title: 'Адрес',
          width: 400,
        },
        {
          key: 'liquid_pgm_volume',
          title: 'Объем жидких ПГМ',
          width: 200,
        },
        {
          key: 'solid_pgm_volume',
          title: 'Объем твердых ПГМ',
          width: 200,
        },
        {
          key: 'pgm_stores_type_name',
          title: 'Тип ПГМ',
          width: 200,
        },
      ],
    },
  },
};
