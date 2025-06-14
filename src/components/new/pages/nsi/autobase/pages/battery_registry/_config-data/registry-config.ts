import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryRegistryPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'batteryRegistryRegistry';

export const getToConfig = (): TypeConfigData<BatteryRegistry> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/battery_registry',
      },
      removeOneData: {
        entity: 'autobase/battery_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр аккумуляторов', // Реестр аккумуляторов основной

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
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'brand_id',
          labelKey: 'brand_name',
          title: 'Марка аккумулятора',
          type: 'multiselect',
        },
        {
          valueKey: 'serial_number',
          title: 'Серийный номер',
          type: 'multiselect',
        },
        {
          valueKey: 'lifetime_months',
          title: 'Срок службы',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'worked_months',
          title: 'Количество месяцев наработки',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'manufacturer_id',
          labelKey: 'manufacturer_name',
          title: 'Изготовитель',
          type: 'multiselect',
        },
        {
          valueKey: 'released_at',
          title: 'Дата выпуска',
          type: 'advanced-date',
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
          title: 'Дата установки',
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
      permissions: batteryRegistryPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'battery_registry_registry_id',
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
            title: 'Организация',
            width: 200,
          },
          {
            key: 'brand_name',
            title: 'Марка аккумулятора',
            width: 200,
          },
          {
            key: 'serial_number',
            title: 'Серийный номер',
            width: 200,
          },
          {
            key: 'lifetime_months',
            title: 'Срок службы',
            width: 200,
          },
          {
            key: 'worked_months',
            title: 'Количество месяцев наработки',
            width: 300,
          },
          {
            key: 'manufacturer_name',
            title: 'Изготовитель',
            width: 200,
          },
          {
            key: 'released_at',
            title: 'Дата выпуска',
            format: 'date',
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
            width: 200,
          },
          {
            key: 'installed_at',
            title: 'Дата установки',
            format: 'date',
            width: 200,
          },
          {
            key: 'status_text',
            title: 'Статус',
            width: 200,
          },
        ],
      },
    },
  };
};
