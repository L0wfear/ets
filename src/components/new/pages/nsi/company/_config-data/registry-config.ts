import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/company/_config-data/permissions';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'Company';

export const config: TypeConfigData<Company> = {
  Service: {
    getRegistryData: {
      entity: 'companies',
      typeAns: 'result',
    },
  },
  registryKey,
  header: {
    title: 'Реестр организаций',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
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
        type: 'multiselect',
        title: 'Полное наименование',
      },
      {
        valueKey: 'short_name',
        type: 'multiselect',
        title: 'Краткое наименование',
      },
      {
        valueKey: 'has_remote_checkup',
        type: 'multiselect',
        title: 'Наличие дистанционного мед. осмотра',
        options: YES_NO_SELECT_OPTIONS_BOOL,
      },
      {
        valueKey: 'use_pouring',
        type: 'multiselect',
        title: 'Использование типа заправки "Налив"',
        options: YES_NO_SELECT_OPTIONS_BOOL,
      },
      {
        valueKey: 'fuel_cards_creating',
        type: 'multiselect',
        title: 'Создание топливных карт',
        options: YES_NO_SELECT_OPTIONS_BOOL,
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'company_id',
      fixedWidth: true,
      uniqKeyForParams: 'company_id',
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
              displayIf: displayIfContant.isKgh,
              title: 'Округ',
            },
          ],
          width: 150,
        },
        {
          key: 'company_name',
          title: 'Полное наименование',
          width: 300,
        },
        {
          key: 'short_name',
          title: 'Краткое наименование',
          width: 300,
        },
        {
          key: 'has_remote_checkup',
          title: 'Наличие дистанционного мед. осмотра',
          width: 300,
          format: 'boolean',
        },
        {
          key: 'use_pouring',
          title: 'Использование типа заправки "Налив"',
          width: 300,
          format: 'boolean',
        },
        {
          key: 'fuel_cards_creating',
          title: 'Создание топливных карт',
          width: 300,
          format: 'boolean',
        },
      ],
    },
  },
};
