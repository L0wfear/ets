import TrTd from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/renderers/TrTd';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';

export const registryKey = 'OdhList';

export const config: TypeConfigData<Odh> = {
  Service: {
    getActionPath: ['geoobjectActions', 'actionGetGetOdh'],
    getBlobActionPath: ['geoobjectActions', 'actionGetBlobOdh'],
  },
  registryKey,
  header: {
    title: 'Справочник ОДХ',
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
            title: 'Учреждение',
            displayIf: displayIfContant.isOkrug,
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'id',
        title: 'Идентификатор (ID)',
        type: 'multiselect',
      },
      {
        valueKey: 'name',
        title: 'Название',
        type: 'multiselect',
      },
      {
        valueKey: 'clean_category_name',
        title: 'Категория',
        type: 'multiselect',
      },
      {
        valueKey: 'total_area',
        title: 'Общая площадь (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'distance',
        title: 'Протяженность (п.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'roadway_area',
        title: 'Площадь проезжей части (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'footway_area',
        title: 'Площадь тротуаров (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'cleaning_area',
        title: 'Площадь уборки (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'footway_length',
        title: 'Длина тротуара (п.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'auto_footway_area',
        title: 'Площадь механизированной уборки тротуаров (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'manual_footway_area',
        title: 'Площадь ручной уборки тротуаров (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'snow_area',
        title: 'Площадь уборки снега (кв.м.)',
        type: 'advanced-number',
      },
      {
        valueKey: 'gutters_length',
        title: 'Протяженность лотков (п.м.)',
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
              title: 'Учреждение',
              displayIf: displayIfContant.isOkrug,
            },
          ],
          width: 300,
        },
        {
          key: 'id',
          title: 'Идентификатор (ID)',
          width: 160,
        },
        {
          key: 'name',
          title: 'Название',
        },
        {
          key: 'clean_category_name',
          title: 'Категория',
          width: 300,
        },
        {
          key: 'total_area',
          title: 'Общая площадь (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'distance',
          title: 'Протяженность (п.м.)',
          format: 'toFixed2',
        },
        {
          key: 'roadway_area',
          title: 'Площадь проезжей части (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'footway_area',
          title: 'Площадь тротуаров (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'cleaning_area',
          title: 'Площадь уборки (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'footway_length',
          title: 'Длина тротуара (п.м.)',
          format: 'toFixed2',
        },
        {
          key: 'auto_footway_area',
          title: 'Площадь механизированной уборки тротуаров (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'manual_footway_area',
          title: 'Площадь ручной уборки тротуаров (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'snow_area',
          title: 'Площадь уборки снега (кв.м.)',
          format: 'toFixed2',
        },
        {
          key: 'gutters_length',
          title: 'Протяженность лотков (п.м.)',
          format: 'toFixed2',
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
