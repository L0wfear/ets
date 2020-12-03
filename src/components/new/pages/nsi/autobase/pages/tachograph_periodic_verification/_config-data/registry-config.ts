import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import tachographPermissions from './permissions';

export const registryKey = 'tachographPeriodicVerification';

export const getToConfig = (): TypeConfigData<Tachograph> => {
  return {
    Service: {
      getBlobData: {
        entity: 'autobase/tachograph_periodic_verification/export',
        payload: {
          format: 'xls',
        },
      },
      getRegistryData: {
        entity: 'autobase/tachograph_periodic_verification',
      },
    },
    registryKey,
    header: {
      title: 'Реестр периодических поверок тахографов',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.remove,
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
        {
          valueKey: 'verification_number',
          title: 'Номер поверки',
          type: 'multiselect',
        },
        {
          valueKey: 'calibration_date',
          title: 'Дата калибровки',
          type: 'advanced-date',
        },
        {
          valueKey: 'calibration_type_name',
          title: 'Тип калибровки',
          type: 'multiselect',
        },
        {
          valueKey: 'verification_reason_name',
          title: 'Причина внеплановой калибровки',
          type: 'multiselect',
        },
        {
          valueKey: 'next_calibration_date',
          title: 'Дата следующей калибровки (план)',
          type: 'advanced-date',
        },
        {
          valueKey: 'tachograph_brand_name',
          title: 'Марка тахографа',
          type: 'multiselect',
        },
        {
          valueKey: 'factory_number',
          title: 'Заводской номер тахографа',
          type: 'multiselect',
        },
        {
          valueKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'comment',
          title: 'Комментарий',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: tachographPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tachograph_periodic_verification_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 200,
            dashIfEmpty: true,
          },
          {
            key: 'verification_number',
            title: 'Номер поверки',
            width: 200,
          },
          {
            key: 'calibration_date',
            format: 'date',
            title: 'Дата калибровки',
            width: 200,
          },
          {
            key: 'calibration_type_name',
            title: 'Тип калибровки',
            width: 200,
          },
          {
            key: 'verification_reason_name',
            title: 'Причина внеплановой калибровки',
            width: 200,
            dashIfEmpty: true,
          },
          {
            key: 'next_calibration_date',
            format: 'date',
            title: 'Дата следующей калибровки (план)',
            width: 200,
          },
          {
            key: 'tachograph_brand_name',
            title: 'Марка тахографа',
            width: 200,
          },
          {
            key: 'factory_number',
            title: 'Заводской номер тахографа',
            width: 200,
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 200,
          },
          {
            key: 'files',
            title: 'Сертификат (файл)',
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
