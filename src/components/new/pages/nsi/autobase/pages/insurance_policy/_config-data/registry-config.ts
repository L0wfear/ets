import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { InsurancePolicy } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import insurancePolicyPermissions from './permissions';
import {displayIfContant} from '../../../../../../ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { insurancePolicyArchivePermissions } from '../../insurance_policy_archive/_config-data/permissions';

export const registryKey = 'insurancePolicyRegistry';

export const getToConfig = (car_id?: number, is_archive: boolean = false, title: string = 'Реестр страховок', regKey = registryKey): TypeConfigData<InsurancePolicy> => {
  const Service: TypeConfigData<InsurancePolicy>['Service'] = {
    getRegistryData: {
      entity: 'autobase/insurance_policy_registry',
      payload: {
        is_archive,
      },
    },
    getBlobData: {
      entity: 'autobase/insurance_policy_registry',
      payload: {
        is_archive,
      },
    },
    removeOneData: {
      entity: 'autobase/insurance_policy_registry',
      uniqKeyLikeQueryString: false,
    },
  };
  const buttons: TypeConfigData<InsurancePolicy>['header']['buttons'] = !is_archive
    ? [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.create,
      buttonsTypes.read,
      buttonsTypes.remove,
      buttonsTypes.insurance_policy_to_archive,
      buttonsTypes.export,
    ]
    : [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.insurance_policy_from_archive,
      buttonsTypes.export,
    ];
  const permissions = is_archive ? insurancePolicyArchivePermissions : insurancePolicyPermissions;
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
    registryKey: regKey,
    header: {
      title,
      buttons,
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
              title: 'Организация',
              displayIf: displayIfContant.isKgh,
            }
          ],
          type: 'multiselect',
        },
        {
          valueKey: 'car_id',
          labelKey: 'gov_numbers_text',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'is_not_insurable',
          title: 'Не подлежит страхованию',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
          nullAsFalse: true,
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
          step: 1,
        },
        {
          valueKey: 'note',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
      ],
    },
    list: {
      permissions,
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
            key: 'okrug_name',
            title: [
              {
                title: 'Округ',
                displayIf: displayIfContant.isKgh,
              }
            ],
            width: 150,
            dashIfEmpty: true,
          },
          {
            key: 'company_name',
            title: [
              {
                displayIf: displayIfContant.isKgh,
                title: 'Организация',
              },
              {
                displayIf: displayIfContant.isOkrug,
                title: 'Учреждение',
              },
            ],
            width: 200,
            dashIfEmpty: true,
          },
          {
            key: 'gov_numbers_text',
            title: 'Рег. номер ТС',
            width: 200,
            fieldTitlePopup: 'В скобках указывается номер ТС на дату начала действия страховки',
            dashIfEmpty: true,
          },
          {
            key: 'is_not_insurable',
            title: 'Не подлежит страхованию',
            width: 200,
            valueForBoolean: 'Не подлежит',
          },
          {
            key: 'insurer',
            title: 'Страховая организация',
            width: 200,
            dashIfEmpty: true,
          },
          {
            key: 'insurance_type_name',
            title: 'Тип страхования',
            width: 200,
            dashIfEmpty: true,
          },
          {
            key: 'seria',
            title: 'Серия',
            width: 100,
            dashIfEmpty: true,
          },
          {
            key: 'number',
            title: 'Номер',
            width: 100,
            dashIfEmpty: true,
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
            dashIfEmpty: true,
          },
          {
            key: 'note',
            title: 'Примечание',
            width: 200,
            dashIfEmpty: true,
          },
        ],
      },
    },
  };
};
