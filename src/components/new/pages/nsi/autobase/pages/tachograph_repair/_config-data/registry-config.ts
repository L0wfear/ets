import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographRepairList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import tachographRepairPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'TachographRepair';

export const getToConfig = (): TypeConfigData<TachographRepairList> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tachograph_repair',
        payload: {
        },
      },
      getBlobData: {
        entity:  'autobase/tachograph_repair/export',
      }
    },
    registryKey,
    header: {
      title: 'Реестр ремонтов тахографов',

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
          valueKey: 'okrug_name',
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
          valueKey: 'company_structure_id',
          labelKey: 'company_structure_name',
          title: 'Подразделение',
          type: 'multiselect',
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
          valueKey: 'repair_date',
          title: 'Дата проведения ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'repair_reason_name',
          title: 'Причина ремонта',
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
      permissions: tachographRepairPermissions,
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
            key: 'tachograph_brand_name',
            title: 'Марка тахографа',
            width: 200,
          },
          {
            key: 'factory_number',
            title: 'Заводской номер тахографа',
            width: 100,
          },
          {
            key: 'repair_date',
            title: 'Дата проведения ремонта',
            format: 'date',
            width: 150,
          },
          {
            key: 'repair_reason_name',
            title: 'Причина ремонта',
            width: 150,
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 150,
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
