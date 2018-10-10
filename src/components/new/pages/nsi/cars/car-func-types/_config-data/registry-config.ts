import { TypesService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';

export const registryKey = 'CarFuncTypes';

export const config: TypeConfigData = {
  Service: TypesService,
  registryKey,
  header: {
    title: 'Типы техники',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'full_name',
        type: 'multiselect',
        title: 'Полное наименование',
      },
      {
        valueKey: 'group_name',
        type: 'multiselect',
        title: 'Группа',
      },
      {
        valueKey: 'short_name',
        type: 'multiselect',
        title: 'Краткое наименование',
      },
    ],
  },
  list: {
    data: {
      uniqKey: 'asuods_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'full_name',
          title: 'Полное наименование',
        },
        {
          key: 'group_name',
          title: 'Группа',
          className: 'width300',
        },
        {
          key: 'short_name',
          title: 'Краткое наименование',
          className: 'width300',
        },
      ],
    },
  },
};
