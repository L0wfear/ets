import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import { TachographRepairList } from 'redux-main/reducers/modules/autobase/actions_by_type/tachograph_repair/@types';
import tachographRepairPermissions from './permissions';

export const registryKey = 'TachographRepair';

export const getToConfig = (tachograph_id = 0): TypeConfigData<TachographRepairList> => {
  return {
    Service: {
      getRegistryData: {
        entity: 'autobase/tachograph_repair',
        payload: {
          tachograph_id,
        },
      },
      getBlobData: {
        entity:  'autobase/tachograph_repair/export',
        payload: {
          tachograph_id,
        },
      }
    },
    registryKey,
    header: {
      title: 'Реестр ремонтов тахографов',

      buttons: [
        buttonsTypes.filter,
        buttonsTypes.export_filtred_data,
      ],
    },
    filter: {
      fields: [
        {
          valueKey: 'repair_date',
          title: 'Дата проведения ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'repair_reason_name',
          title: 'Причина ремонта',
          type: 'multiselect',
        },
      ],
    },
    list: {
      permissions: tachographRepairPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        disableDoubleClick: true,
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'repair_date',
            title: 'Дата проведения ремонта',
            format: 'datetime',
            width: 150,
          },
          {
            key: 'repair_reason_name',
            title: 'Причина ремонта',
            width: 150,
          },
          {
            key: 'comment',
            title: 'Комментарий',
            width: 150,
          },
        ],
      },
    },
  };
};
