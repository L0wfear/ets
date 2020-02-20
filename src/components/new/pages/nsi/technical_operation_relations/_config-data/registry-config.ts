import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import technicalOperationRelationsPermissions from './permissions';
import { TechnicalOperationRelations } from 'redux-main/reducers/modules/technical_operation_relations/@types/technicalOperationRelations';
import { Route } from 'redux-main/reducers/modules/routes/@types';
import { CarFuncTypes } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { MunicipalFacility } from 'redux-main/reducers/modules/some_uniq/municipal_facility/@types';
import { TechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/@types';

export const registryKey = 'technicalOperationRelationsRegistry';

export const getToConfig = (
  technical_operation_id?: TechnicalOperationRegistry['id'],
  municipal_facility_id?: MunicipalFacility['municipal_facility_id'],
  route_types?: Route['type'],
  func_type_id?: CarFuncTypes['asuods_id'],
): TypeConfigData<TechnicalOperationRelations> => {
  return {
    noInitialLoad: true,
    Service: {
      getRegistryData: {
        entity: 'technical_operation_relations',
        format: 'technical_operation_relations',
        payload: {
          technical_operation_id,
          municipal_facility_id,
          route_types,
          func_type_id,
        },
      },
    },
    registryKey,
    header: {
      title: 'Сводная форма связей',
      format: 'select_for_technical_operation_relations',
      buttons: [
        buttonsTypes.filter,
        buttonsTypes.change_driver_technical_operation_relations,
        buttonsTypes.change_route_technical_operation_relations,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'gov_number',
          title: 'Рег. номер ТС',
          type: 'multiselect',
        },
        {
          valueKey: 'employees',
          title: 'Водители/машинисты',
          type: 'multiselect',
        },
        {
          valueKey: 'route_names_only',
          title: 'Маршруты',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: technicalOperationRelationsPermissions,
      data: {
        uniqKey: 'asuods_id',
        fixedWidth: true,
        uniqKeyForParams: 'technical_operation_relations_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'gov_number',
            title: 'Рег. номер ТС',
            width: 200,
          },
          {
            key: 'employees',
            title: 'Водители/машинисты',
            width: 300,
          },
          {
            key: 'route_names_string',
            title: 'Маршруты',
            width: 500,
          },
        ],
      },
    },
  };
};
