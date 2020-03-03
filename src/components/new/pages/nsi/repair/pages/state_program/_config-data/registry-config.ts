import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import stateProgramPermissions from './permissions';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';

export const registryKey = 'stateProgramRegistry';

export const getToConfig = (): TypeConfigData<StateProgram> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'repair/state_program',
      },
      removeOneData: {
        entity: 'repair/state_program',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Справочник государственных программ ремонта',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.remove,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'name',
          title: 'Наименование государственной программы',
          type: 'multiselect',
        },
        {
          valueKey: 'status_id',
          labelKey: 'status_name',
          title: 'Статус',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: stateProgramPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'state_program_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'checkbox',
          },
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Наименование государственной программы',
          },
          {
            key: 'status_name',
            title: 'Статус',
          },
        ],
      },
    },
  };
};
