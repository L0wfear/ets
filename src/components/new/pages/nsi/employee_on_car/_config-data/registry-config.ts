import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import employeeOnCarPermissions from './permissions';
import { EmployeeOnCar } from 'redux-main/reducers/modules/employee_on_car/@types/employeeOnCar';
import carActualPermissions from '../../autobase/pages/car_actual/_config-data/permissions';
import {
  config,
} from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data/registry-config';

export const registryKey = 'employeeOnCarRegistry';
import { id } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const getToConfig = (): TypeConfigData<EmployeeOnCar> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'employee_on_car',
        format: 'employee_on_car',
      },
      getBlobData: {
        entity: 'employee_on_car',
      }
    },
    registryKey,
    header: {
      title: 'Матрица распределения ТС и водителей',
      buttons: [
        {
          id: 'open-update_car-form',
          type: buttonsTypes.read,
          title: 'Просмотреть карточку ТС',
          glyph: 'none',
          other_params: {
            otherUniqKeyForParamsData: {
              key: config.list.data.uniqKeyForParams,
              path: 'asuods_id',
              permissions: [carActualPermissions.read, carActualPermissions.update],
            },
          },
        },
        buttonsTypes.filter,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'okrug_id',
          labelKey: 'okrug_name',
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
          valueKey: 'asuods_id',
          labelKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'garage_number',
          title: 'Гаражный номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'special_model_name',
          title: 'Марка шасси ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'full_model_name',
          title: 'Модель ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'type_name',
          title: 'Тип техники',
          type: 'multiselect',
        },
        {
          valueKey: 'condition_text',
          title: 'Состояние',
          type: 'multiselect',
        },
        {
          valueKey: 'operating_mode',
          title: 'Режим работы',
          type: 'multiselect',
        },
        {
          valueKey: 'driver_phone',
          title: 'Телефон',
          type: 'multiselect',
        },
        {
          valueKey: 'assigned_car_count',
          title: 'Количество закрепленных ТС за водителем',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'employee_id',
          labelKey: 'driver_fio',
          title: 'ФИО водителя/машиниста',
          type: 'multiselect',
        },
        {
          valueKey: 'binding_type',
          labelKey: 'binding_type_text',
          title: 'Тип закрепления ',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: employeeOnCarPermissions,
      data: {
        uniqKey: 'frontId',
        fixedWidth: true,
        uniqKeyForParams: id,
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
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 200,
          },
          {
            key: 'garage_number',
            title: 'Гаражный номер ТС',
            width: 200,
          },
          {
            key: 'special_model_name',
            title: 'Марка шасси ТС',
            width: 200,
          },
          {
            key: 'full_model_name',
            title: 'Модель ТС',
            width: 200,
          },
          {
            key: 'type_name',
            title: 'Тип техники',
            width: 200,
          },
          {
            key: 'condition_text',
            title: 'Состояние',
            width: 200,
          },
          {
            key: 'operating_mode',
            title: 'Режим работы',
            width: 200,
          },
          {
            key: 'driver_fio',
            title: 'ФИО водителя/машиниста',
            width: 400,
          },
          {
            key: 'driver_phone',
            title: 'Телефон',
            width: 200,
          },
          {
            key: 'binding_type_text',
            title: 'Тип закрепления ',
            width: 200,
          },
          {
            key: 'assigned_car_count',
            title: 'Количество закрепленных ТС за водителем',
            width: 200,
          },
          {
            key: 'comment',
            title: 'Комментарий',
            width: 200,
          },
        ],
      },
    },
  };
};
