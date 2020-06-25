import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { SparePart } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import sparePartPermissions from './permissions';

export const registryKey = 'sparePartRegistry';

export const getToConfig = (): TypeConfigData<SparePart> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/spare_part_registry',
      },
      removeOneData: {
        entity: 'autobase/spare_part_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр запчастей',
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
          valueKey: 'okrug_name',
          title: 'Округ',
          type: 'multiselect',
        },
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
          valueKey: 'quantity',
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
        uniqKeyForParams: 'spare_part_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'okrug_name',
            title: 'Округ',
            width: 150,
          },
          {
            key: 'company_name',
            title: 'Организация',
            width: 200,
          },
          {
            key: 'group_name',
            title: 'Группа',
            width: 200,
          },
          {
            key: 'number',
            title: 'Номер поставки',
            width: 200,
          },
          {
            key: 'name',
            title: 'Подгруппа',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
          {
            key: 'quantity',
            title: 'Количество',
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
