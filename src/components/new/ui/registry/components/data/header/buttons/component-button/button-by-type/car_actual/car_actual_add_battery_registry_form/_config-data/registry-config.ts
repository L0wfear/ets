import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryRegistryPermissions from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data/permissions';
import { AutoBaseBatteryRegistryService } from 'api/Services';

export const registryKey = 'batteryRegistryAddButton';

export const getToConfig = (company_id: number, ): TypeConfigData<BatteryRegistry> => {
  return {
    Service: {
      getRegistryData: {
        entity: AutoBaseBatteryRegistryService._path,
        payload: {
          company_id,
        },
      },
      removeOneData: {
        entity: AutoBaseBatteryRegistryService._path,
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр аккумуляторов', // Реестр аккумуляторов для добавления

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
          valueKey: 'manufacturer_id',
          labelKey: 'manufacturer_name',
          title: 'Изготовитель',
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
      permissions: batteryRegistryPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'battery_registry_add_button_id',
      },
      meta: {
        row_double_click: true,
        fields: [
          {
            key: 'enumerated',
            title: '№',
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
            key: 'manufacturer_name',
            title: 'Изготовитель',
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
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 200,
          },
          {
            key: 'gov_number',
            title: 'Установлен на',
            width: 200,
          },
        ],
      },
    },
  };
};
