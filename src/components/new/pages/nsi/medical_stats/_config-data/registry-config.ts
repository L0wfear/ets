import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import medicalStatsPermissions from './permissions';
import { MedicalStats } from 'redux-main/reducers/modules/medical_stats/@types/medicalStats';

export const registryKey = 'medicalStatsRegistry';

export const getToConfig = (date_from, date_to): TypeConfigData<MedicalStats> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'medical_stats',
        payload: {
          date_from,
          date_to,
        },
      },
      getBlobData: {
        entity: 'medical_stats',
        payload: {
          format: 'xls',
          date_from,
          date_to,
        },
      },
    },
    registryKey,
    header: {
      title: 'Статистика прохождения мед. осмотров',
      format: 'datetime_range_picker',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'employee_name',
          title: 'ФИО сотрудника',
          type: 'multiselect',
        },
        {
          valueKey: 'employee_birthday',
          title: 'Дата рождения',
          type: 'advanced-date',
        },
        {
          valueKey: 'employee_position',
          title: 'Должность',
          type: 'multiselect',
        },
        {
          valueKey: 'allowed_name',
          title: 'Результат мед.осмотра',
          type: 'multiselect',
        },
        {
          valueKey: 'conclusion',
          title: 'Заключение о результате мед.осмотра',
          type: 'multiselect',
        },
        {
          valueKey: 'type_name',
          title: 'Тип мед.осмотра',
          type: 'multiselect',
        },
        {
          valueKey: 'sign_datetime',
          title: 'Дата и время подписи результата мед.осмотра',
          type: 'advanced-date',
        },
      ],
    },
    list: {
      permissions: medicalStatsPermissions,
      data: {
        fixedWidth: true,
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'employee_name',
            title: 'ФИО сотрудника',
            width: 175,
          },
          {
            key: 'employee_birthday',
            title: 'Дата рождения',
            format: 'date',
            width: 150,
          },
          {
            key: 'employee_position',
            title: 'Должность',
            width: 150,
          },
          {
            key: 'allowed_name',
            title: 'Результат мед.осмотра',
            width: 250,
          },
          {
            key: 'conclusion',
            title: 'Заключение о результате мед.осмотра',
            width: 325,
          },
          {
            key: 'type_name',
            title: 'Тип мед.осмотра',
            width: 175,
          },
          {
            key: 'sign_datetime',
            title: 'Дата и время подписи результата мед.осмотра',
            format: 'datetime',
            width: 375,
          },
        ],
      },
    },
  };
};
