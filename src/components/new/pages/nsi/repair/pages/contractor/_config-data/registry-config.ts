import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import contractorPermissions from './permissions';
import { Contractor } from 'redux-main/reducers/modules/repair/cleaning_rate/@types/contractor';

export const registryKey = 'contractorRegistry';

export const getToConfig = (): TypeConfigData<Contractor> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'repair/contractor',
      },
      removeOneData: {
        entity: 'repair/contractor',
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Справочник Подрядчиков',
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
          valueKey: 'name',
          title: 'Наименование',
          type: 'multiselect',
        },
        {
          valueKey: 'inn',
          title: 'ИНН',
          type: 'multiselect',
        },
        {
          valueKey: 'kpp',
          title: 'КПП',
          type: 'multiselect',
        },
        {
          valueKey: 'ogrn',
          title: 'ОГРН',
          type: 'multiselect',
        },
        {
          valueKey: 'okpo',
          title: 'ОКПО',
          type: 'multiselect',
        },
        {
          valueKey: 'postal_address',
          title: 'Почтовый адрес',
          type: 'multiselect',
        },
        {
          valueKey: 'email',
          title: 'Электронный адрес',
          type: 'multiselect',
        },
        {
          valueKey: 'phone',
          title: 'Телефон',
          type: 'multiselect',
        },
        {
          valueKey: 'fax',
          title: 'Факс',
          type: 'multiselect',
        },
        {
          valueKey: 'bik',
          title: 'БИК',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: contractorPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'contractor_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'checkbox',
          },
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Наименование',
            width: 150,
          },
          {
            key: 'inn',
            title: 'ИНН',
            width: 125,
          },
          {
            key: 'kpp',
            title: 'КПП',
            width: 100,
          },
          {
            key: 'ogrn',
            title: 'ОГРН',
            width: 150,
          },
          {
            key: 'okpo',
            title: 'ОКПО',
            width: 100,
          },
          {
            key: 'postal_address',
            title: 'Почтовый адрес',
            width: 200,
          },
          {
            key: 'email',
            title: 'Электронный адрес',
            width: 200,
          },
          {
            key: 'phone',
            title: 'Телефон',
            width: 125,
          },
          {
            key: 'fax',
            title: 'Факс',
            width: 150,
          },
          {
            key: 'bik',
            title: 'БИК',
            width: 200,
          },
        ],
      },
    },
  };
};
