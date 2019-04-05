import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import insurancePolicyPermissions from './permissions';

export const registryKey = 'insurancePolicyRegistry';

export const getToConfig = (car_id?: number): TypeConfigData<InsurancePolicy> => {
  const Service: any = {
    getRegistryData: {
      entity: 'autobase/insurance_policy_registry',
    },
    removeOneData: {
      entity: 'autobase/insurance_policy_registry',
      uniqKeyLikeQueryString: false,
    },
  };

  if (car_id) {
    Service.getRegistryData.payload = {
      car_id,
    };

    Service.getBlobData = {
      entity: 'autobase/insurance_policy_registry',
      payload: {
        car_id,
        format: 'xls',
      },
    };
  }

  return {
    Service,
    registryKey,
    header: {
      title: 'Реестр техосмотров',
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
          valueKey: 'car_id',
          labelKey: 'gov_number',
          title: [
            {
              title: 'Транспортное средство',
              displayIf: displayIfContant.carActualAsuodsIdInParams,
            },
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'insurer',
          title: 'Страховая организация',
          type: 'multiselect',
        },
        {
          valueKey: 'insurance_type_name',
          title: 'Тип страхования',
          type: 'multiselect',
        },
        {
          valueKey: 'seria',
          title: 'Серия',
          type: 'multiselect',
        },
        {
          valueKey: 'number',
          title: 'Номер',
          type: 'advanced-string-like',
        },
        {
          valueKey: 'date_start',
          title: 'Дата начала действия',
          type: 'advanced-date',
        },
        {
          valueKey: 'date_end',
          title: 'Дата окончания действия',
          type: 'advanced-date',
        },
        {
          valueKey: 'price',
          title: 'Стоимость, руб.',
          type: 'advanced-number',
        },
        {
          valueKey: 'note',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
      ],
    },
    list: {
      permissions: insurancePolicyPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'insurance_policy_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'gov_number',
            title: [
              {
                title: 'Транспортное средство',
                displayIf: displayIfContant.carActualAsuodsIdInParams,
              },
            ],
            width: 200,
          },
          {
            key: 'insurer',
            title: 'Страховая организация',
            width: 200,
          },
          {
            key: 'insurance_type_name',
            title: 'Тип страхования',
            width: 200,
          },
          {
            key: 'seria',
            title: 'Серия',
            width: 100,
          },
          {
            key: 'number',
            title: 'Номер',
            width: 100,
          },
          {
            key: 'date_start',
            title: 'Дата начала действия',
            format: 'date',
            width: 150,
          },
          {
            key: 'date_end',
            title: 'Дата окончания действия',
            format: 'date',
            width: 150,
          },
          {
            key: 'price',
            title: 'Стоимость, руб.',
            width: 150,
          },
          {
            key: 'note',
            title: 'Примечание',
            width: 200,
          },
        ],
      },
    },
  };
};
