import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { Penalty } from 'redux-main/reducers/modules/autobase/actions_by_type/penalties/@types';
import penaltyPermissions from './permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { YES_NO_SELECT_OPTIONS_INT } from 'constants/dictionary';

export const registryKey = 'Penalties';

export const getToConfig = (): TypeConfigData<Penalty> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'penalties',
        payload: {
        },
      },
    },
    registryKey,
    header: {
      title: 'Реестр штрафов',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.read,
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
          valueKey: 'violation_datetime',
          title: 'Дата и время правонарушения',
          type: 'advanced-date',
        },
        {
          valueKey: 'violation_document_number',
          title: 'Номер постановления',
          type: 'multiselect',
        },
        {
          valueKey: 'driver_id',
          labelKey: 'driver_fio',
          title: 'Водитель',
          type: 'multiselect',
        },
        {
          valueKey: 'waybills',
          title: 'Номер путевого листа',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'missions',
          title: 'Номер задания',
          type: 'advanced-number',
          step: 1,
        },
        {
          valueKey: 'is_appealed',
          title: 'Обжалованный штраф',
          type: 'multiselect',
          options: YES_NO_SELECT_OPTIONS_INT,
        },
      ],
    },
    list: {
      permissions: penaltyPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'penalties_id',
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
            width: 150,
          },
          {
            key: 'violation_datetime',
            format: 'datetime',
            title: 'Дата и время правонарушения',
            width: 200,
          },
          {
            key: 'violation_document_number',
            title: 'Номер постановления',
            width: 200,
          },
          {
            key: 'driver_fio',
            title: 'Водитель',
            width: 250,
          },
          {
            key: 'waybills_text',
            title: 'Номер путевого листа',
            width: 150,
          },
          {
            key: 'missions_text',
            title: 'Номер задания',
            width: 150,
          },
          {
            key: 'is_appealed',
            title: 'Обжалованный штраф',
            format: 'boolean',
            width: 150,
          },
        ],
      },
    },
  };
};
