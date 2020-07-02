import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/geoobjects/pages/dt/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Dt } from 'redux-main/reducers/modules/geoobject/actions_by_type/dt/@types';
import { geoozones } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'DtList';

export const config: TypeConfigData<Dt> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones.dt}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник ДТ',
    buttons: [
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
            displayIf: displayIfContant.isKgh,
            title: 'Организация',
          },
        ],
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
        step: 0.01,
      },
      {
        valueKey: 'clean_area',
        title: 'Общая уборочная площадь (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'auto_area',
        title: 'Площадь механизированной уборки (кв.м.)',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'area_machine_sum',
        title: 'Территория уборки усовершенствованных покрытий, все классы, механизированная, кв.м',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'area_hand_improved_sum',
        title: 'Площадь усовершенствованных покрытий для ручной уборки, кв.м',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'improved_cover_flag',
        title: 'Признак наличия элемента «Усовершенствованное покрытие»',
        type: 'multiselect',
        options: [
          { value: true, label: 'Да' },
          { value: false, label: 'Нет' },
        ],
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
      uniqKey: 'yard_id',
      fixedWidth: true,
      uniqKeyForParams: 'dt_id',
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
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          width: 300,
        },
        {
          key: 'yard_id',
          title: 'Идентификатор (ID)',
          width: 200,
        },
        {
          key: 'object_address',
          title: 'Название ДТ',
          width: 200,
        },
        {
          key: 'total_area',
          title: 'Общая площадь (кв.м.)',
          format: 'toFixed2',
          width: 150,
        },
        {
          key: 'clean_area',
          title: 'Общая уборочная площадь (кв.м.)',
          format: 'toFixed2',
          width: 200,
        },
        {
          key: 'auto_area',
          title: 'Площадь механизированной уборки (кв.м.)',
          format: 'toFixed2',
          width: 250,
        },
        {
          key: 'area_machine_sum',
          title: 'Территория уборки усовершенствованных покрытий, все классы, механизированная, кв.м',
          width: 250,
        },
        {
          key: 'area_hand_improved_sum',
          title: 'Площадь усовершенствованных покрытий для ручной уборки, кв.м',
          width: 250,
        },
        {
          key: 'improved_cover_flag',
          title: 'Признак наличия элемента «Усовершенствованное покрытие»',
          width: 250,
          format: 'yesOrNot',
        },
        {
          key: 'company_structures',
          title: 'Подразделение',
          width: 400,
          format: 'array_of_object_name',
        },
      ],
    },
  },
};
