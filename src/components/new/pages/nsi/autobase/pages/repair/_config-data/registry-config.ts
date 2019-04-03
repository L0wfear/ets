import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { Repair } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import repairPermissions from './permissions';
import { AUTOBASE_REPAIR_STATUS } from 'redux-main/reducers/modules/autobase/actions_by_type/repair/status';

export const registryKey = 'repairRegistry';

export const getToConfig = (car_id?: number): TypeConfigData<Repair> => {

  const Service: any = {
    getRegistryData: {
      entity: 'autobase/repair_registry',
    },
    removeOneData: {
      entity: 'autobase/repair_registry',
      uniqKeyLikeQueryString: false,
    },
  };

  if (car_id) {
    Service.getRegistryData.payload = {
      car_id,
    };

    Service.getBlobData = {
      entity: 'autobase/repair_registry',
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
      title: 'Ремонты ТС',
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
          valueKey: 'repair_company_name',
          title: 'Исполнитель ремонта',
          type: 'multiselect',
        },
        {
          valueKey: 'repair_type_name',
          title: 'Вид ремонта',
          type: 'multiselect',
        },
        {
          valueKey: 'number',
          title: 'Номер документа',
          type: 'multiselect',
        },
        {
          valueKey: 'plan_date_start',
          title: 'Плановая дата начала ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'plan_date_end',
          title: 'Плановая дата окончания ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_start',
          title: 'Фактическая дата начала ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'fact_date_end',
          title: 'Фактическая дата окончания ремонта',
          type: 'advanced-date',
        },
        {
          valueKey: 'description',
          title: 'Описание неисправности',
          type: 'advanced-string-like',
        },
        {
          valueKey: 'note',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
        {
          valueKey: 'status',
          title: 'Статус',
          type: 'multiselect',
          options: Object.entries(AUTOBASE_REPAIR_STATUS).map(([key, { name }]) => ({
            value: key, label: name,
          })),
        },
      ],
    },
    list: {
      permissions: repairPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'repair_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
          },
          {
            key: 'repair_company_name',
            title: 'Исполнитель ремонта',
            width: 150,
          },
          {
            key: 'repair_type_name',
            title: 'Вид ремонта',
            width: 100,
          },
          {
            key: 'number',
            title: 'Номер документа',
            width: 200,
          },
          {
            key: 'plan_date_start',
            title: 'Плановая дата начала ремонта',
            format: 'date',
            width: 150,
          },
          {
            key: 'plan_date_end',
            title: 'Плановая дата окончания ремонта',
            format: 'date',
            width: 150,
          },
          {
            key: 'fact_date_start',
            title: 'Фактическая дата начала ремонта',
            format: 'date',
            width: 150,
          },
          {
            key: 'fact_date_end',
            title: 'Фактическая дата окончания ремонта',
            format: 'date',
            width: 150,
          },
          {
            key: 'description',
            title: 'Описание неисправности',
            width: 150,
          },
          {
            key: 'note',
            title: 'Примечание',
            width: 200,
          },
          {
            key: 'status',
            title: 'Статус',
            format: 'AUTOBASE_REPAIR_STATUS',
            width: 100,
          },
        ],
      },
    },
  };
};
