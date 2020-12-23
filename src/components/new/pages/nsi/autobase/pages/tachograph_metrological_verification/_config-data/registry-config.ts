import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographMetrologicalVerificationList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_metrological_verification/@types';
import tachographMetrologicalVerificationPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'TachographMetrologicalVerification';

export const getToConfig = (): TypeConfigData<TachographMetrologicalVerificationList> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tachograph_metrological_verification',
        payload: {
        },
      },
      getBlobData: {
        entity:  'autobase/tachograph_metrological_verification/export',
      }
    },
    registryKey,
    header: {
      title: 'Реестр метрологических поверок тахографов',

      buttons: [
        buttonsTypes.columns_control,
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
          valueKey: 'company_structure_id',
          labelKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
        },
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
      permissions: tachographMetrologicalVerificationPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'id',
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
                displayIf: displayIfContant.isKgh,
                title: 'Округ',
              },
            ],
            width: 100,
          },
          {
            key: 'company_name',
            title: [
              {
                displayIf: displayIfContant.isKgh,
                title: 'Организация',
              },
            ],
            width: 200,
          },
          {
            key: 'company_structure_name',
            title: 'Подразделение',
            width: 150,
            dashIfEmpty: true,
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
            key: 'tachograph_brand_name',
            title: 'Марка тахографа',
            width: 150,
          },
          {
            key: 'factory_number',
            title: 'Заводской номер тахографа',
            width: 150,
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 150,
          },
          {
            key: 'files',
            title: 'Сертификат (файл)',
          },
          {
            key: 'comment',
            title: 'Комментарий',
            width: 150,
          },
        ],
      },
    },
  };
};
