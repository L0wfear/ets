import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { MaintenanceRate } from 'redux-main/reducers/modules/maintenance_rate/@types/maintenanceRate.h';
import { PropsMaintenanceRate } from 'components/new/pages/nsi/regulatory_indicator/pages/maintenance_rate/form/@types/MaintenanceRateForm';

export const maintenanceRateSchema: SchemaType<MaintenanceRate, PropsMaintenanceRate> = {
  properties: {
    technical_operation_id: {
      title: 'Технологическая операция',
      type: 'valueOfArray',
      required: true,
    },
    maintenance_work_id: {
      title: 'Наименование регламентной работы',
      type: 'valueOfArray',
      required: true,
    },
    season_id: {
      title: 'Сезон',
      type: 'valueOfArray',
      required: true,
    },
    clean_category_id: {
      title: 'Категория',
      type: 'valueOfArray',
      required: true,
    },
    clean_subcategory_id: {
      title: 'Подкатегория',
      type: 'valueOfArray',
      required: false,
    },
    value: {
      title: 'Норма',
      type: 'number',
      float: 3,
      required: true,
    },
  },
};
