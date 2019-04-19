import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import objectPropertyPermissions from './permissions';
import { ObjectProperty } from 'redux-main/reducers/modules/repair/object_property/@types/objectProperty';

export const registryKey = 'objectPropertyRegistry';

export const getToConfig = (object_type?: ObjectProperty['type_slug']): TypeConfigData<ObjectProperty> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'object_property',
        payload: {
          object_type,
        },
      },
      removeOneData: {
        entity: 'object_property',
        uniqKeyLikeQueryString: false,
      },
      getBlobData: {
        entity: 'object_property',
        payload: {
          object_type,
          format: 'xls',
        },
      },
    },
    registryKey,
    header: {
      title: 'Справочник характеристик объектов',
      format: 'select_odh/dt',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.export,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'name',
          title: 'Наименование характеристики',
          type: 'multiselect',
        },
        {
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: objectPropertyPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'object_property_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Наименование характеристики',
            width: 200,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
        ],
      },
    },
  };
};
