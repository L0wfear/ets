import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import maintenanceWorkPermissions from './permissions';
import { MaintenanceWork } from 'redux-main/reducers/modules/some_uniq/maintenance_work/@types';
import { MaintenanceWorkService } from 'api/Services';

export const registryKey = 'maintenanceWorkRegistry';

export const getToConfig = (): TypeConfigData<MaintenanceWork> => {
  return {
    Service: {
      getRegistryData: {
        entity: MaintenanceWorkService._path,
      },
      removeOneData: {
        entity: MaintenanceWorkService._path,
        uniqKeyLikeQueryString: false,
      },
    },
    registryKey,
    header: {
      title: 'Показатели регламентных работ',
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
          valueKey: 'measure_unit_id',
          labelKey: 'measure_unit_name',
          title: 'Единица измерения',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: maintenanceWorkPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'maintenance_work_registry_id',
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
            key: 'measure_unit_name',
            title: 'Единица измерения',
            width: 200,
          },
        ],
      },
    },
  };
};
