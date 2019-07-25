import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { BatteryRegistry } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import batteryRegistryPermissions from 'components/new/ui/registry/components/data/header/buttons/component-button/button-by-type/car_actual/car_actual_add_battery_registry_form/_config-data/permissions';

export const registryKey = 'batteryRegistryAddButton';

export const getToConfig = (is_current_structure: boolean, company_id: number, ): TypeConfigData<BatteryRegistry> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'autobase/battery_registry',
        payload: {
          is_current_structure,
          company_id,
        },
      },
      removeOneData: {
        entity: 'autobase/battery_registry',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр аккумуляторов для добавления',

      format: 'is_current_structure',
      is_current_structure_popover: 'Отобразятся аккумуляторы, установленные на текущую дату на ТС Вашего подразделения',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.select,
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
            key: 'gov_number',
            title: 'Установлен на',
            width: 200,
          },
        ],
      },
    },
  };
};
