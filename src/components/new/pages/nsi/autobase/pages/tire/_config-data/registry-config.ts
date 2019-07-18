import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { Tire } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import tirePermissions from './permissions';

export const registryKey = 'tireRegistry';

export const getToConfig = (is_current_structure: boolean): TypeConfigData<Tire> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'autobase/tire_registry',
        payload: {
          is_current_structure,
        },
      },
      removeOneData: {
        entity: 'autobase/tire_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр шин',

      format: 'is_current_structure',
      is_current_structure_popover: 'Отобразятся шины, установленные на текущую дату на ТС Вашего подразделения',

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
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'tire_model_id',
          labelKey: 'tire_model_name',
          title: 'Модель шины',
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
          valueKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'installed_at',
          title: 'Дата монтажа',
          type: 'advanced-date',
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
            key: 'company_name',
            title: 'Организация',
            width: 150,
          },
          {
            key: 'tire_model_name',
            title: 'Модель шины',
            width: 200,
          },
          {
            key: 'tire_size_name',
            title: 'Размер',
            width: 150,
          },
          {
            key: 'odometr_diff',
            title: 'Пробег, км',
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
            key: 'buttonCloneTire',
            title: ' ',
          },
        ],
      },
    },
  };
};
