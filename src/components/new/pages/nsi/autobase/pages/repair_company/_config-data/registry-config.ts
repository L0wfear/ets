import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { RepairCompany } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import repairCompanyPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'repairCompanyRegistry';

export const getToConfig = (): TypeConfigData<RepairCompany> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/repair_company',
      },
      removeOneData: {
        entity: 'autobase/repair_company',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Реестр ремонтных организаций',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.create,
        buttonsTypes.read,
        buttonsTypes.remove,
        buttonsTypes.export,
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
          valueKey: 'name',
          title: 'Наименование ремонтной организации',
          type: 'multiselect',
        },
        {
          valueKey: 'comment',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
      ],
    },
    list: {
      permissions: repairCompanyPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'repair_company_registry_id',
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
                title: 'Округ',
                displayIf: displayIfContant.isKgh,
              }
            ],
            width: 150,
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
            key: 'name',
            title: 'Наименование ремонтной организации',
            width: 400,
          },
          {
            key: 'comment',
            title: 'Примечание',
            width: 300,
          },
        ],
      },
    },
  };
};
