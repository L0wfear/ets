import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import sparePartPermissions from './permissions';

export const registryKey = 'sparePartRegistry';

export const getToConfig = (car_id): TypeConfigData<SparePart> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/actual_spare_part_on_car',
        payload: {
          car_id,
        },
      },
    },
    registryKey,
    header: {
      title: 'Реестр запчастей',
      buttons: [],
    },
    filter: {
      fields: [
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'group_name',
          title: 'Группа',
          type: 'multiselect',
        },
        {
          valueKey: 'number',
          title: 'Номер поставки',
          type: 'multiselect',
        },
        {
          valueKey: 'name',
          title: 'Подгруппа',
          type: 'multiselect',
        },
        {
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
        {
          valueKey: 'count_part',
          title: 'Количество',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'supplied_at',
          title: 'Дата поставки',
          type: 'advanced-date',
        },
      ],
    },
    list: {
      permissions: sparePartPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'actual_spare_part_on_car_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'group_name',
            title: 'Группа',
            width: 200,
          },
          {
            key: 'name',
            title: 'Подгруппа',
            width: 200,
          },
          {
            key: 'number',
            title: 'Номер поставки',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
          {
            key: 'count_part',
            title: 'Количество',
            width: 200,
          },
          {
            key: 'installed_at',
            title: 'Дата монтажа',
            format: 'date',
            width: 200,
          },
          {
            key: 'supplied_at',
            title: 'Дата поставки',
            format: 'date',
            width: 200,
          },
        ],
      },
    },
  };
};
