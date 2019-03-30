import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/cars/pages/types-attr/_config-data/permissions';
import { TypesAttr } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const registryKey = 'TypesAttr';

export const config: TypeConfigData<TypesAttr> = {
  Service: {
    getRegistryData: {
      entity: 'types_attr',
      format: 'typesAttr',
    },
  },
  registryKey,
  header: {
    title: 'Таблица нормативных скоростей и ширин',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'oper_type_name',
        type: 'multiselect',
        title: 'Сезон',
      },
      {
        valueKey: 'work_class_short_name',
        type: 'multiselect',
        title: 'Объект ГХ',
      },
      {
        valueKey: 'short_name',
        type: 'multiselect',
        title: 'Тип техники',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'types_attr_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'oper_type_name',
          title: 'Сезон',
          width: 100,
        },
        {
          key: 'work_class_short_name',
          title: 'Объект ГХ',
          width: 150,
        },
        {
          key: 'short_name',
          title: 'Тип техники',
          width: 150,
        },
        {
          key: 'speed_lim',
          title: 'Максимально допустимая скорость, км/ч',
          width: 250,
        },
        {
          key: 'mkad_speed_lim',
          title: 'Максимально допустимая скорость на МКАД, км/ч',
          width: 300,
        },
        {
          key: 'equip_width',
          title: 'Ширина уборочного оборудования, м',
          width: 250,
        },
      ],
    },
  },
};
