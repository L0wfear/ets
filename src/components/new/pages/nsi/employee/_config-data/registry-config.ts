import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/employee/_config-data/permissions';
import {
  WORK_NOT_SELECT_OPTIONS,
  YES_NO_SELECT_OPTIONS_BOOL_STRING,
  YES_NO_SELECT_OPTIONS_BOOL,
} from 'constants/dictionary';
import { Employee } from 'redux-main/reducers/modules/employee/@types/employee.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'Employee';

export const config: TypeConfigData<Employee> = {
  Service: {
    getRegistryData: {
      entity: 'employee',
      format: 'employee',
    },
    getBlobData: {
      entity: 'employee/export',
    }
  },
  registryKey,
  header: {
    title: 'Реестр сотрудников',
    buttons: [
      buttonsTypes.filter,
      {
        id: 'open-create-form',
        type: buttonsTypes.create,
      },
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
            title: 'Организация',
          },
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Учреждение',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'full_name',
        title: 'Фамилия Имя Отчество',
        type: 'multiselect',
      },
      {
        valueKey: 'birthday',
        title: 'Дата рождения',
        type: 'advanced-date',
      },
      {
        valueKey: 'snils',
        title: 'СНИЛС',
        type: 'multiselect',
      },
      {
        valueKey: 'personnel_number',
        title: 'Табельный номер',
        type: 'multiselect',
      },
      {
        valueKey: 'position_name',
        title: 'Должность',
        type: 'multiselect',
      },
      {
        valueKey: 'drivers_license',
        title: 'Водительское удостоверение',
        type: 'multiselect',
      },
      {
        valueKey: 'drivers_license_date_end',
        title: 'Срок действия водительского удостоверения',
        type: 'advanced-date',
      },
      {
        valueKey: 'special_license',
        title: 'Специальное удостоверение',
        type: 'multiselect',
      },
      {
        valueKey: 'special_license_date_end',
        title: 'Срок действия специального удостоверения',
        type: 'advanced-date',
      },
      {
        valueKey: 'company_structure_name',
        title: 'Подразделение',
        type: 'multiselect',
      },
      {
        valueKey: 'active',
        title: 'Текущее состояние',
        type: 'multiselect',
        options: WORK_NOT_SELECT_OPTIONS,
      },
      {
        valueKey: 'phone',
        title: 'Телефон',
        type: 'multiselect',
      },
      {
        valueKey: 'medical_certificate',
        title: 'Медицинская справка',
        type: 'multiselect',
      },
      {
        valueKey: 'is_common',
        title: 'Общее',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_BOOL,
      },
      {
        valueKey: 'has_car',
        title: 'Показать незакрепленных за ТС водителей',
        type: 'multiselect',
        options: YES_NO_SELECT_OPTIONS_BOOL_STRING,
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'employee_id',
    },
    processed: {
      sort: {
        field: 'full_name',
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
              title: 'Организация',
            },
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Учреждение',
            },
          ],
          width: 200,
        },
        {
          key: 'full_name',
          title: 'Фамилия Имя Отчество',
          width: 300,
        },
        {
          key: 'birthday',
          title: 'Дата рождения',
          format: 'date',
          width: 150,
        },
        {
          key: 'snils',
          title: 'СНИЛС',
          dashIfEmpty: true,
          width: 200,
        },
        {
          key: 'personnel_number',
          title: 'Табельный номер',
          width: 250,
        },
        {
          key: 'position_name',
          title: 'Должность',
          width: 200,
        },
        {
          key: 'prefer_car_text',
          title: 'Основное ТС',
          width: 200,
        },
        {
          key: 'secondary_car_text',
          title: 'Вторичное ТС',
          width: 200,
        },
        {
          key: 'drivers_license',
          title: 'Водительское удостоверение',
          width: 200,
        },
        {
          key: 'category_drivers_license_text',
          title: 'Категория водительского удостоверения',
          width: 200,
        },
        {
          key: 'drivers_license_date_end',
          title: 'Срок действия водительского удостоверения',
          width: 250,
          format: 'date',
        },
        {
          key: 'special_license',
          title: 'Специальное удостоверение',
          width: 200,
        },
        {
          key: 'category_special_license_text',
          title: 'Категория специального удостоверения',
          width: 200,
        },
        {
          key: 'special_license_date_end',
          title: 'Срок действия специального удостоверения',
          width: 350,
          format: 'date',
        },
        {
          key: 'company_structure_name',
          title: 'Подразделение',
          width: 200,
        },
        {
          key: 'active',
          title: 'Текущее состояние',
          width: 150,
          format: 'workOrNot',
        },
        {
          key: 'phone',
          title: 'Телефон',
          width: 150,
        },
        {
          key: 'medical_certificate',
          title: 'Медицинская справка',
          width: 200,
        },
        {
          key: 'is_common',
          title: 'Общее',
          format: 'boolean',
          width: 100,
        },
      ],
    },
  },
};
