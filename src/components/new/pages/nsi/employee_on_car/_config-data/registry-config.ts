import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import employeeOnCarPermissions from './permissions';
import { EmployeeOnCar } from 'redux-main/reducers/modules/employee_on_car/@types/employeeOnCar';
import carActualPermissions from '../../autobase/pages/car_actual/_config-data/permissions';

export const registryKey = 'employeeOnCarRegistry';
import { id } from 'components/new/pages/nsi/autobase/pages/car_actual/_config-data';

export const getToConfig = (): TypeConfigData<EmployeeOnCar> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'employee_on_car',
        format: 'employee_on_car',
      },
    },
    registryKey,
    header: {
      title: 'Матрица распределения ТС и водителей',
      buttons: [
        buttonsTypes.read_employee_on_car,
        buttonsTypes.filter,
      ],
    },
    filter: {
      fields: [
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
      permissions: {
        ...employeeOnCarPermissions,
        read: carActualPermissions.update,
      },
      data: {
        uniqKey: 'frontId',
        fixedWidth: true,
        uniqKeyForParams: id,
      },
      meta: {
        row_double_click: false,
        fields: [
          {
            key: 'enumerated',
            title: '№',
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
            key: 'driver_fio',
            title: 'ФИО водителя/машиниста',
            width: 400,
          },
          {
            key: 'binding_type_text',
            title: 'Тип закрепления ',
            width: 200,
          },
        ],
      },
    },
  };
};
