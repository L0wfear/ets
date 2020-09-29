import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
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
    getBlobData: {
      entity:  'geozones/pgm_store/export',
    }
  },
  registryKey,
  header: {
    title: 'Справочник пунктов отпуска ПГМ',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export_filtred_data,
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
      uniqKeyForParams: 'pgm_store_id',
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
