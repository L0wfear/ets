import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographMetrologicalVerificationList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import tachographMetrologicalVerificationPermissions from './permissions';

export const registryKey = 'TachographMetrologicalVerification';

export const getToConfig = (tachograph_id = 0): TypeConfigData<TachographMetrologicalVerificationList> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tachograph_metrological_verification',
        payload: {
          tachograph_id,
        },
      },
      getBlobData: {
        entity:  'autobase/tachograph_metrological_verification/export',
        payload: {
          tachograph_id
        }
      }
    },
    registryKey,
    header: {
      title: 'Реестр метрологических проверок данного тахографа',

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
          valueKey: 'verification_date',
          title: 'Дата проведения поверки',
          type: 'advanced-date',
        },
      ],
    },
    list: {
      permissions: tachographMetrologicalVerificationPermissions,
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
            width: 150,
          },
          {
            key: 'verification_date',
            title: 'Дата проведения поверки',
            format: 'date',
            width: 150,
          },
          {
            key: 'files',
            title: 'Сертификат',
          },
        ],
      },
    },
  };
};
