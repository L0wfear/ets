import { TypesService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/cars/pages/car-func-types/_config-data/permissions';

export const registryKey = 'CarFuncTypes';

export const config: TypeConfigData = {
  Service: TypesService,
  registryKey,
  header: {
    title: 'Типы техники',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
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
      {
        valueKey: 'avg_work_hours',
        type: 'advanced-number',
        title: 'Среднее количество часов работы',
      },
    ],
  },
  list: {
    permissions,
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
          width: 300,
        },
        {
          key: 'short_name',
          title: 'Краткое наименование',
          width: 300,
        },
        {
          key: 'avg_work_hours',
          title: 'Среднее количество часов работы',
          width: 300,
        },
      ],
    },
  },
};
