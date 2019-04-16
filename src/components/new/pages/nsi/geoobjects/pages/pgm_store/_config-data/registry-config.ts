import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/pgm_store/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { geoozones } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'PgmStoreList';

export const config: TypeConfigData<PgmStore> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones.pgm_store}`,
    },
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
        step: 1,
      },
      {
        valueKey: 'solid_pgm_volume',
        title: 'Объем твердых ПГМ',
        type: 'advanced-number',
        step: 1,
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
      fixedWidth: true,
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
          key: 'address',
          title: 'Адрес',
          width: 200,
        },
        {
          key: 'liquid_pgm_volume',
          title: 'Объем жидких ПГМ',
          width: 250,
        },
        {
          key: 'solid_pgm_volume',
          title: 'Объем твердых ПГМ',
          width: 250,
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
