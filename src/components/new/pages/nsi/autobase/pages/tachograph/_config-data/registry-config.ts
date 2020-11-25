import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographListWithOuterProps } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_registry/@types';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import tachographPermissions from './permissions';

export const registryKey = 'tachograph';

export const getToConfig = (): TypeConfigData<TachographListWithOuterProps> => {
  return {
    Service: {
      getBlobData: {
        entity: 'autobase/tachograph_registry/export',
        payload: {
          format: 'xls',
        },
      },
      getRegistryData: {
        entity: 'autobase/tachograph_registry',
      },
    },
    registryKey,
    header: {
      title: 'Реестр тахографов',

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
          type: 'multiselect',
          title: [
            {
              displayIf: displayIfContant.lenghtStructureMoreOne,
              title: 'Подразделение',
            },
          ],
        },
        {
          valueKey: 'tachograph_brand_name',
          title: 'Марка тахографа',
          type: 'multiselect',
        },
        {
          valueKey: 'install_company_name',
          title: 'Фирма-установщик',
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
          valueKey: 'installed_at',
          title: 'Дата монтажа',
          type: 'advanced-date',
        },
        {
          valueKey: 'activated_at',
          title: 'Дата активации',
          type: 'advanced-date',
        },
        {
          valueKey: 'replacement_date',
          title: 'Дата замены блока СКЗИ (факт)',
          type: 'advanced-date',
        },
        {
          valueKey: 'next_replacement_date',
          title: 'Дата следующей замены блока СКЗИ (план)',
          type: 'advanced-date',
        },
        {
          valueKey: 'calibration_date',
          title: 'Дата последней калибровки (факт)',
          type: 'advanced-date',
        },
        {
          valueKey: 'next_calibration_date',
          title: 'Дата следующей калибровки (план)',
          type: 'advanced-date',
        },
        {
          valueKey: 'repair_date',
          title: 'Дата последнего ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'verification_date',
          title: 'Последняя метрологическая поверка: дата проведения',
          type: 'advanced-date',
        },
        {
          valueKey: 'verification_date_validity',
          title: 'Метрологическая поверка: срок действия',
          type: 'advanced-date',
        },
        {
          valueKey: 'reading_fact_date',
          title: 'Дата считывания данных тахографа (факт)',
          type: 'advanced-date',
        },
        {
          valueKey: 'reading_plan_date',
          title: 'Дата считывания данных тахографа (план)',
          type: 'advanced-date',
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
        uniqKeyForParams: 'id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'company_structure_name',
            title: [
              {
                displayIf: displayIfContant.lenghtStructureMoreOne,
                title: 'Подразделение',
              },
            ],
            dashIfEmpty: true,
            width: 200,
          },
          {
            key: 'tachograph_brand_name',
            title: 'Марка тахографа',
            width: 200,
          },
          {
            key: 'install_company_name',
            title: 'Фирма-установщик',
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
            key: 'installed_at',
            format: 'date',
            title: 'Дата монтажа',
            width: 200,
          },
          {
            key: 'activated_at',
            format: 'date',
            title: 'Дата активации',
            width: 200,
          },
          {
            key: 'plan_replacement',
            format: 'date',
            title: 'Плановая дата замены блока СКЗИ',
            width: 200,
          },
          {
            key: 'replacement_date',
            format: 'date',
            title: 'Дата замены блока СКЗИ (факт)',
            width: 200,
          },
          {
            key: 'next_replacement_date',
            format: 'date',
            title: 'Дата следующей замены блока СКЗИ (план)',
            width: 200,
          },
          {
            key: 'calibration_date',
            format: 'date',
            title: 'Дата последней калибровки (факт)',
            width: 200,
          },
          {
            key: 'next_calibration_date',
            format: 'date',
            title: 'Дата следующей калибровки (план)',
            width: 200,
          },
          {
            key: 'repair_date',
            format: 'date',
            title: 'Дата последнего ремонта',
            width: 200,
          },
          {
            key: 'verification_date',
            format: 'date',
            title: 'Последняя метрологическая поверка: дата проведения',
            width: 200,
          },
          {
            key: 'verification_date_validity',
            format: 'date',
            title: 'Метрологическая поверка: срок действия',
            width: 200,
          },
          {
            key: 'reading_fact_date',
            format: 'date',
            title: 'Дата считывания данных тахографа (факт)',
            width: 200,
          },
          {
            key: 'reading_plan_date',
            format: 'date',
            title: 'Дата считывания данных тахографа (план)',
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
