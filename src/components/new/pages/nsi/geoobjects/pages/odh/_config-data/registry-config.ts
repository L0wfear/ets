import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/geoobjects/pages/odh/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Odh } from 'redux-main/reducers/modules/geoobject/actions_by_type/odh/@types';
import { geoozones, odh } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'OdhList';

export const config: TypeConfigData<Odh> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones[odh]}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник ОДХ',
    buttons: [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
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
            displayIf: displayIfContant.isOkrug,
            title: 'Наименование ГБУ',
          },
          {
            title: 'Организация',
            displayIf: displayIfContant.isKgh,
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
        step: 0.01,
      },
      {
        valueKey: 'distance',
        title: 'Протяженность (п.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'roadway_area',
        title: 'Площадь мех. уборки проезжей части (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'footway_area',
        title: 'Площадь тротуаров (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'cleaning_area',
        title: 'Площадь уборки (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'footway_length',
        title: 'Длина тротуара (п.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'auto_footway_area',
        title: 'Площадь механизированной уборки тротуаров (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'manual_footway_area',
        title: 'Площадь ручной уборки тротуаров (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'snow_area',
        title: 'Площадь уборки снега (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'gutters_length',
        title: 'Протяженность лотков (п.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'margin_area',
        title: 'Площадь обочин (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'company_structures',
        title: 'Подразделение',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'odh_id',
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
              displayIf: displayIfContant.isOkrug,
              title: 'Наименование ГБУ',
            },
            {
              title: 'Организация',
              displayIf: displayIfContant.isKgh,
            },
          ],
          width: 300,
        },
        {
          key: 'id',
          title: 'Идентификатор (ID)',
          width: 200,
        },
        {
          key: 'name',
          title: 'Название',
          width: 200,
        },
        {
          key: 'clean_category_name',
          title: 'Категория',
          width: 150,
        },
        {
          key: 'total_area',
          title: 'Общая площадь (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'distance',
          title: 'Протяженность (п.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'roadway_area',
          title: 'Площадь мех. уборки проезжей части (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'footway_area',
          title: 'Площадь тротуаров (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'cleaning_area',
          title: 'Площадь уборки (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'footway_length',
          title: 'Длина тротуара (п.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'auto_footway_area',
          title: 'Площадь механизированной уборки тротуаров (кв.м.)',
          format: 'toFixed2',
          width: 300,
        },
        {
          key: 'manual_footway_area',
          title: 'Площадь ручной уборки тротуаров (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'snow_area',
          title: 'Площадь уборки снега (кв.м.)',
          format: 'toFixed2',
          width: 250,
        },
        {
          key: 'gutters_length',
          title: 'Протяженность лотков (п.м.)',
          format: 'toFixed2',
          width: 300,
        },
        {
          key: 'margin_area',
          title: 'Площадь обочин (кв.м)',
          format: 'toFixed2',
          width: 300,
        },
        {
          key: 'company_structures',
          title: 'Подразделение',
          format: 'array_of_object_name',
          width: 400,
        },
      ],
    },
  },
};
