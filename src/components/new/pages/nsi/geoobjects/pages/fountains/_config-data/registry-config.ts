import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/geoobjects/pages/fountains/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { Fountains } from 'redux-main/reducers/modules/geoobject/actions_by_type/fountains/@types';
import { gormost } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'FountainsList';

export const config: TypeConfigData<Fountains> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${gormost.fountains}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник фонтанов',
    buttons: [
      buttonsTypes.filter,
      buttonsTypes.read,
      buttonsTypes.export,
    ],
  },
  filter: {
    fields: [
      {
        valueKey: 'company_name',
        title: [
          {
            displayIf: displayIfContant.isKgh,
            title: 'Наименование ГБУ',
          },
          {
            displayIf: displayIfContant.isOkrug,
            title: 'Учреждение',
          },
        ],
        type: 'multiselect',
      },
      {
        valueKey: 'name',
        title: 'Наименование',
        type: 'multiselect',
      },
      {
        valueKey: 'adm_area',
        title: 'Административный округ',
        type: 'multiselect',
      },
      {
        valueKey: 'district',
        title: 'Район',
        type: 'multiselect',
      },
      {
        valueKey: 'location',
        title: 'Адресный ориентир',
        type: 'multiselect',
      },
      {
        valueKey: 'departmental_affiliation',
        title: 'Ведомственная принадлежность',
        type: 'multiselect',
      },
      {
        valueKey: 'balance_holder_name',
        title: 'Балансодержатель',
        type: 'multiselect',
      },
      {
        valueKey: 'balance_holder_phone',
        title: 'Телефон балансодержателя',
        type: 'multiselect',
      },
      {
        valueKey: 'balance_holder_email',
        title: 'Электронная почта балансодержателя',
        type: 'multiselect',
      },
      {
        valueKey: 'balance_holder_web_site',
        title: 'Сайт балансодержателя',
        type: 'multiselect',
      },
      {
        valueKey: 'operation_organization_name',
        title: 'Эксплуатирующая организация',
        type: 'multiselect',
      },
      {
        valueKey: 'operation_organization_phone',
        title: 'Телефон эксплуатирующей организации',
        type: 'multiselect',
      },
      {
        valueKey: 'operation_organization_email',
        title: 'Электронная почта эксплуатирующей организации',
        type: 'multiselect',
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'fountain_id',
    },
    meta: {
      fields: [
        {
          key: 'enumerated',
          title: '№',
        },
        {
          key: 'company_name',
          title: [
            {
              displayIf: displayIfContant.isKgh,
              title: 'Наименование ГБУ',
            },
            {
              displayIf: displayIfContant.isOkrug,
              title: 'Учреждение',
            },
          ],
          width: 200,
        },
        {
          key: 'name',
          title: 'Наименование',
          width: 200,
        },
        {
          key: 'adm_area',
          title: 'Административный округ',
          width: 250,
        },
        {
          key: 'district',
          title: 'Район',
          width: 150,
        },
        {
          key: 'location',
          title: 'Адресный ориентир',
          width: 200,
        },
        {
          key: 'departmental_affiliation',
          title: 'Ведомственная принадлежность',
          width: 300,
        },
        {
          key: 'balance_holder_name',
          title: 'Балансодержатель',
          width: 200,
        },
      ],
    },
  },
};
