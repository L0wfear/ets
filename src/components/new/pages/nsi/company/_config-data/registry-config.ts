import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/company/_config-data/permissions';
import { Company } from 'redux-main/reducers/modules/company/@types';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

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
        options: YES_NO_SELECT_OPTIONS_INT,
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
      ],
    },
  },
};
