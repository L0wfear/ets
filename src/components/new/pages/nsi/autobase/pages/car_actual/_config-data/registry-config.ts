import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import {
  YES_NO_SELECT_OPTIONS_BOOL,
} from 'constants/dictionary';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

export const registryKey = 'CarActual';

export const config: TypeConfigData<Car> = {
  Service: {
    getRegistryData: {
      entity: 'car_actual',
      format: 'carActual',
    },
    getBlobData: {
      entity:  'car_actual/export',
    }
  },
  registryKey,
  header: {
    title: 'Реестр транспортных средств',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export_filtred_data,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'company_name',
        title: [
          {
            displayIf: displayIfContant.isKgh,
            title: 'Наименование ГБУ',
          },
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Учреждение',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'company_name_customer',
        title: [
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Заказчик',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'company_name_contractor',
        title: [
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Подрядчик',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'owner_name',
        title: [
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Владелец',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'gov_number',
        title: 'Рег. номер ТС',
        type: 'multiselect',
      },
      {
        valueKey: 'special_model_name',
        title: 'Модель ТС',
        type: 'multiselect',
      },
      {
        valueKey: 'full_model_name',
        title: 'Марка шасси ТС',
        type: 'multiselect',
      },
      {
        valueKey: 'car_group_name',
        title: 'Группа техники',
        type: 'multiselect',
      },
      {
        valueKey: 'type_name',
        title: 'Тип',
        type: 'multiselect',
      },
      {
        valueKey: 'condition_text',
        title: 'Состояние',
        type: 'multiselect',
      },
      {
        valueKey: 'garage_number',
        title: 'Гаражный номер',
        type: 'multiselect',
      },
      {
        valueKey: 'fuel_correction_rate',
        title: 'Поправочный коэффициент',
        type: 'multiselect',
      },
      {
        valueKey: 'company_structure_name',
        title: 'Подразделение предприятия',
        type: 'multiselect',
      },
      {
        valueKey: 'gps_code',
        title: 'Код БНСО',
        type: 'multiselect',
      },
      {
        valueKey: 'is_common',
        title: 'Общее',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_BOOL,
      },
      {
        valueKey: 'equipment_sensors_types_ids',
        title: 'Установленные КБМ',
        type: 'multiselect',
        getRegistryData: {
          entity: 'sensor_type',
          valueKey: 'id',
          labelKey: 'name',
          mergeWithArray: true,
        },
      },
      {
        valueKey: 'level_sensors_num',
        title: 'Количество установленных ДУТ',
        type: 'multiselect',
      },
      {
        valueKey: 'season_name',
        title: 'Сезонность',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'asuods_id',
      fixedWidth: true,
      uniqKeyForParams: 'car_actual_asuods_id',
    },
    processed: {
      sort: {
        field: 'asuods_id',
        reverse: false,
      },
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Наименование ГБУ',
            },
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Учреждение',
            },
          ],
          width: 200,
        },
        {
          key: 'company_name_customer',
          title: [
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Заказчик',
            },
          ],
          width: 200,
        },
        {
          key: 'company_name_contractor',
          title: [
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Подрядчик',
            },
          ],
          width: 200,
        },
        {
          key: 'owner_name',
          title: [
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Владелец',
            },
          ],
          width: 200,
        },
        {
          key: 'gov_number',
          title: 'Рег. номер ТС',
          width: 150,
        },
        {
          key: 'special_model_name',
          title: 'Модель ТС',
          width: 200,
        },
        {
          key: 'full_model_name',
          title: 'Марка шасси ТС',
          width: 300,
        },
        {
          key: 'car_group_name',
          title: 'Группа техники',
          width: 250,
        },
        {
          key: 'type_name',
          title: 'Тип',
          width: 200,
        },
        {
          key: 'condition_text',
          title: 'Состояние',
          width: 200,
        },
        {
          key: 'garage_number',
          title: 'Гаражный номер',
          width: 200,
        },
        {
          key: 'fuel_correction_rate',
          title: 'Поправочный коэффициент',
          format: 'toFixed2',
          width: 250,
        },
        {
          key: 'company_structure_name',
          title: 'Подразделение предприятия',
          width: 300,
        },
        {
          key: 'gps_code',
          title: 'Код БНСО',
          width: 150,
        },
        {
          key: 'is_common',
          title: 'Общее',
          format: 'boolean',
          width: 100,
        },
        {
          key: 'equipment_sensors_str',
          title: 'Установленные КБМ',
          width: 200,
        },
        {
          key: 'level_sensors_num',
          title: 'Количество установленных ДУТ',
          width: 300,
        },
        {
          key: 'season_name',
          title: 'Сезонность',
          width: 150,
        },
      ],
    },
  },
};
