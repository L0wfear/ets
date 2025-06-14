import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import tirePermissions from './permissions';
import {displayIfContant} from '../../../../../../ui/registry/contants/displayIf';

export const registryKey = 'tireRegistry';

export const getToConfig = (): TypeConfigData<Tire> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tire_registry',
        payload: {
        },
      },
      removeOneData: {
        entity: 'autobase/tire_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр шин', // Реестр шин основной

      buttons: [
        buttonsTypes.columns_control,
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
          title: [
            {
              title: 'Округ',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
          ],
          type: 'multiselect',
        },
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
          valueKey: 'initial_mileage',
          title: 'Первоначальный пробег, км',
          type: 'advanced-number',
          step: 0.01,
        },
        {
          valueKey: 'odometr_diff',
          title: 'Общий пробег, км',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'sum_track_length_km',
          title: 'Общий пробег по ГЛОНАСС, км',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'motohours_diff',
          title: 'Наработка, мч',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'comment',
          title: 'Комментарий',
          type: 'multiselect',
        },
        {
          valueKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
        {
          valueKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'installed_at',
          title: 'Дата монтажа',
          type: 'advanced-date',
        },
        {
          valueKey: 'status_text',
          title: 'Статус',
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
                displayIf: displayIfContant.isKgh,
                title: 'Организация',
              },
            ],
            width: 150,
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
            key: 'initial_mileage',
            title: 'Первоначальный пробег, км',
            width: 250,
          },
          {
            key: 'odometr_diff',
            title: 'Общий пробег, км',
            width: 150,
          },
          {
            key: 'sum_track_length',
            title: 'Общий пробег по ГЛОНАСС, км',
            format: 'metresToKilometeres',
            width: 150,
          },
          {
            key: 'motohours_diff',
            title: 'Наработка, мч',
            width: 150,
          },
          {
            key: 'comment',
            title: 'Комментарий',
            width: 200,
          },
          {
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 150,
          },
          {
            key: 'installed_at',
            title: 'Дата монтажа',
            width: 150,
            format: 'date',
          },
          {
            key: 'status_text',
            title: 'Статус',
            width: 200,
          },
          {
            key: 'buttonCloneTire',
            title: ' ',
          },
        ],
      },
    },
  };
};
