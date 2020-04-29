import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import techInspectionPermissions from './permissions';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';

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
          labelKey: 'company_short_name',
          title: 'Организация',
          type: 'multiselect',
        },
        {
          valueKey: 'car_id',
          labelKey: 'gov_numbers',
          title: 'Рег. номер ТС',
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
        {
          valueKey: 'is_allowed',
          title: 'Заключение о возможности/невозможности эксплуатации ТС',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
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
            key: 'company_short_name',
            title: 'Организация',
            width: 150,
          },
          {
            key: 'gov_numbers_text',
            title: 'Рег. номер ТС',
            width: 200,
            fieldTitlePopup: 'В скобках указывается номер ТС на дату прохождения техосмотра',
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
