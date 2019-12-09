import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import tirePermissions from './permissions';

export const registryKey = 'tireRegistryAddButton';

export const getToConfig = (is_current_structure: boolean, company_id: number, ): TypeConfigData<Tire> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'autobase/tire_registry',
        payload: {
          is_current_structure,
          company_id,
        },
      },
      removeOneData: {
        entity: 'autobase/tire_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр шин', // "Реестр шин для добавления"

      buttons: [
        buttonsTypes.filter,
        {
          id: 'open-update-form',
          type: buttonsTypes.read,
          title: 'Выбрать',
          glyph: 'hand-up',
        },
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'tire_model_id',
          labelKey: 'tire_model_name',
          title: 'Модель шины',
          type: 'multiselect',
        },
        {
          valueKey: 'tire_manufacturer_id',
          labelKey: 'tire_manufacturer_name',
          title: 'Производитель',
          type: 'multiselect',
        },
        {
          valueKey: 'tire_size_id',
          labelKey: 'tire_size_name',
          title: 'Размер',
          type: 'multiselect',
        },
        {
          valueKey: 'motohours_diff',
          title: 'Наработка, мч',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
        {
          valueKey: 'gov_number',
          title: 'Установлен на',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: tirePermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tire_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'tire_model_name',
            title: 'Модель шины',
            width: 200,
          },
          {
            key: 'tire_manufacturer_name',
            title: 'Производитель',
            width: 200,
          },
          {
            key: 'tire_size_name',
            title: 'Размер',
            width: 150,
          },
          {
            key: 'comment',
            title: 'Комментарий',
            width: 200,
          },
          {
            key: 'motohours_diff',
            title: 'Наработка, мч',
            width: 150,
          },
          {
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'gov_number',
            title: 'Установлен на',
            width: 150,
          },
        ],
      },
    },
  };
};
