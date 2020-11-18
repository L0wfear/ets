import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Tachograph } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_periodic_verification/@types';
import tachographPermissions from './permissions';

export const registryKey = 'tachographPeriodicVerification';

export const getToConfig = (tachograph_id = 0): TypeConfigData<Tachograph> => {
  return {
    Service: {
      getBlobData: {
        entity: 'autobase/tachograph_periodic_verification/export',
        payload: {
          format: 'xls',
          tachograph_id,
        },
      },
      getRegistryData: {
        entity: 'autobase/tachograph_periodic_verification',
        payload: {
          tachograph_id
        }
      },
    },
    registryKey,
    header: {
      title: 'Реестр периодических поверок тахографов',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
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
      ],
    },
    list: {
      permissions: tachographPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        disableDoubleClick: true,
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
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
            key: 'files',
            title: 'Сертификат',
          }
        ],
      },
    },
  };
};
