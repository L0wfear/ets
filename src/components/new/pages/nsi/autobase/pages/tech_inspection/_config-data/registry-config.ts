import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TechInspection } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import techInspectionPermissions from './permissions';
import { YES_NO_SELECT_OPTIONS_BOOL } from 'constants/dictionary';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { techInspectionArchivePermissions } from 'components/new/pages/nsi/autobase/pages/tech_inspection_archive/_config-data/permissions';

export const registryKey = 'techInspectionRegistry';

export const getToConfig = (car_id?: number, is_archive: boolean = false, title: string = 'Реестр техосмотров', regKey = registryKey): TypeConfigData<TechInspection> => {

  const Service: TypeConfigData<TechInspection>['Service'] = {
    getRegistryData: {
      entity: 'autobase/tech_inspection_registry',
      payload: {
        is_archive,
      },
    },
    getBlobData: {
      entity: 'autobase/tech_inspection_registry',
      payload: {
        is_archive,
      },
    },
    removeOneData: {
      entity: 'autobase/tech_inspection_registry',
      uniqKeyLikeQueryString: false,
    },
  };
  const buttons: TypeConfigData<TechInspection>['header']['buttons'] = !is_archive
    ? [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.create,
      buttonsTypes.read,
      buttonsTypes.remove,
      buttonsTypes.tech_inspection_to_archive,
      buttonsTypes.export,
    ]
    : [
      buttonsTypes.columns_control,
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.tech_inspection_from_archive,
      buttonsTypes.export,
    ];
  const permissions = is_archive ? techInspectionArchivePermissions : techInspectionPermissions;

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
              displayIf: displayIfContant.isKgh,
              title: 'Организация',
            },
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
          valueKey: 'is_not_inspectionable',
          title: 'Не подлежит прохождению ТО/ГТО',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_BOOL,
          nullAsFalse: true,
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
      permissions,
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
            ],
            width: 150,
            dashIfEmpty: true,
          },
          {
            key: 'gov_numbers_text',
            title: 'Рег. номер ТС',
            width: 200,
            fieldTitlePopup: 'В скобках указывается номер ТС на дату прохождения техосмотра',
            dashIfEmpty: true,
          },
          {
            key: 'is_not_inspectionable',
            title: 'Не подлежит прохождению ТО/ГТО',
            width: 200,
            valueForBoolean: 'Не подлежит',
          },
          {
            key: 'reg_number',
            title: 'Номер диагностической карты/ Талона ГТО',
            width: 200,
            dashIfEmpty: true,
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
            dashIfEmpty: true,
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
            dashIfEmpty: true,
          },
        ],
      },
    },
  };
};
