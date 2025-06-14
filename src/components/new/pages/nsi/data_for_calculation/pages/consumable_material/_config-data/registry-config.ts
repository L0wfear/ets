import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import consumableMaterialPermissions from './permissions';
import { ConsumableMaterialWrap } from 'redux-main/reducers/modules/consumable_material/@types/consumableMaterial';
import { ConsumableMaterialService } from 'api/Services';

export const registryKey = 'consumableMaterialRegistry';

export const getToConfig = (): TypeConfigData<ConsumableMaterialWrap> => {
  return {
    Service: {
      getRegistryData: {
        entity: ConsumableMaterialService._path,
        format: 'consumable_material_wrap',
        payload: {
          is_actual: true,
        },
      },
      removeOneData: {
        entity: ConsumableMaterialService._path,
        uniqKeyLikeQueryString: false,
      },
      getBlobData: {
        entity: ConsumableMaterialService._path,
        payload: {
          format: 'xls',
          is_actual: true,
        },
      },
    },
    registryKey,
    header: {
      title: 'Справочник расходных материалов',
      buttons: [
        buttonsTypes.columns_control,
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
          valueKey: 'short_name',
          title: 'Сокращенное наименование',
          type: 'multiselect',
        },
        {
          valueKey: 'technical_operation_names',
          title: 'Технологическая операция',
          type: 'multiselect',
        },
        {
          valueKey: 'municipal_facility_names',
          title: 'Элемент',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: consumableMaterialPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'consumable_material_registry_id',
      },
      processed: {
        sort: {
          field: 'name',
        },
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'name',
            title: 'Наименование',
            width: 200,
          },
          {
            key: 'short_name',
            title: 'Сокращенное наименование',
            width: 150,
          },
          {
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 100,
          },
          {
            key: 'to_element',
            title: 'Технологическая операция и элемент',
            width: 300,
            format: 'array',
            max_size_to_scroll: 650,
          },
        ],
      },
    },
  };
};
