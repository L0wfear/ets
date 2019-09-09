import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/company_structure/_config-data/permissions';
import { CompanyStructure } from 'redux-main/reducers/modules/company_structure/@types/company_structure.h';

export const registryKey = 'CompanyStructure';

export const config: TypeConfigData<CompanyStructure> = {
  Service: {
    getRegistryData: {
      entity: 'company_structure',
      typeAns: 'result',
    },
    removeOneData: {
      entity: 'company_structure',
      uniqKeyLikeQueryString: true,
    },
  },
  registryKey,
  header: {
    title: 'Структура предприятия',
    buttons: [
      {
        id: 'open-create-form',
        type: buttonsTypes.create,
        title: 'Добавить подразделение',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'company_structure_id',
    },
    meta: {
      fields: [
        {
          key: 'is_open',
          title: ' ',
        },
        {
          key: 'name',
          title: 'Название',
          width: 200,
        },
        {
          key: 'type_display',
          title: 'Тип',
          width: 200,
        },
        {
          key: 'note',
          title: 'Примечание',
          width: 400,
        },
        {
          key: 'company_structure_actions',
          title: 'Действия',
        },
      ],
    },
  },
};
