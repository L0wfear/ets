import { GeozoneDtService } from 'api/Services';
import TrTd from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/renderers/TrTd';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'DtList';

export const config: TypeConfigData = {
  Service: GeozoneDtService,
  registryKey,
  header: {
    title: 'Реестр ДТ',
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
        title: 'Наименование ГБУ',
        displayIf: displayIfContant.isKgh,
        type: 'multiselect',
      },
      {
        valueKey: 'company_name',
        title: 'Учреждение',
        displayIf: displayIfContant.isOkrug,
        type: 'multiselect',
      },
      {
        valueKey: 'yard_id',
        title: 'Идентификатор (ID)',
        type: 'multiselect',
      },
      {
        valueKey: 'object_address',
        title: 'Название ДТ',
        type: 'multiselect',
      },
      {
        valueKey: 'total_area',
        title: 'Общая площадь (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'clean_area',
        title: 'Общая уборочная площадь (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'auto_area',
        title: 'Площадь механизированной уборки (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'company_structure_name',
        title: 'Подразделение',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'yard_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'company_name',
          title: 'Наименование ГБУ',
          displayIf: displayIfContant.isKgh,
          width: 300,
        },
        {
          key: 'company_name',
          title: 'Учреждение',
          displayIf: displayIfContant.isOkrug,
          width: 300,
        },
        {
          key: 'yard_id',
          title: 'Идентификатор (ID)',
          width: 160,
        },
        {
          key: 'object_address',
          title: 'Название ДТ',
          width: 300,
        },
        {
          key: 'total_area',
          title: 'Общая площадь (кв.м.)',
          toFixed: 2,
          width: 200,
        },
        {
          key: 'clean_area',
          title: 'Общая уборочная площадь (кв.м.)',
          toFixed: 2,
          width: 200,
        },
        {
          key: 'auto_area',
          title: 'Площадь механизированной уборки (кв.м.)',
          toFixed: 2,
          width: 200,
        },
        {
          key: 'company_structure_name',
          title: 'Подразделение',
        },
      ],
    },
  },
};

export const components = {
  TrTd,
};
