import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import techInspectionPermissions from './permissions';

export const registryKey = 'techInspectionRegistry';

export const getToConfig = (car_id?: number): TypeConfigData<TechInspection> => {

  const Service: any = {
    getRegistryData: {
      entity: 'autobase/tech_inspection_registry',
    },
    removeOneData: {
      entity: 'autobase/tech_inspection_registry',
      uniqKeyLikeQueryString: false,
    },
  };

  if (car_id) {
    Service.getRegistryData.payload = {
      car_id,
    };

    Service.getBlobData = {
      entity: 'autobase/tech_inspection_registry',
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
          valueKey: 'company_id',
          labelKey: 'company_name',
          title: 'Организация',
          type: 'multiselect',
        },
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
          valueKey: 'reg_number',
          title: 'Номер диагностической карты/ Талона ГТО',
          type: 'multiselect',
        },
        {
          valueKey: 'date_end',
          title: 'Срок действия до',
          type: 'advanced-date',
        },
        {
          valueKey: 'tech_operator',
          title: 'Место выдачи',
          type: 'multiselect',
        },
        {
          valueKey: 'date_start',
          title: 'Дата прохождения',
          type: 'advanced-date',
        },
        {
          valueKey: 'note',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
      ],
    },
    list: {
      permissions: techInspectionPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'tech_inspection_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'company_name',
            title: 'Организация',
            width: 150,
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
            key: 'reg_number',
            title: 'Номер диагностической карты/ Талона ГТО',
            width: 200,
          },
          {
            key: 'date_end',
            title: 'Срок действия до',
            format: 'date',
            width: 150,
          },
          {
            key: 'tech_operator',
            title: 'Место выдачи',
            width: 150,
          },
          {
            key: 'date_start',
            title: 'Дата прохождения',
            format: 'date',
            width: 150,
          },
          {
            key: 'is_allowed',
            title: 'Заключение о возможности эксплуатации ТС',
            format: 'boolean',
            width: 200,
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
