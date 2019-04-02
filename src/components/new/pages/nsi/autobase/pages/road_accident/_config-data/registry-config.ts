import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import { RoadAccident } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import roadAccidentPermissions from './permissions';

export const registryKey = 'roadAccidentRegistry';

export const getToConfig = (car_id?: number): TypeConfigData<RoadAccident> => {

  const Service: any = {
    getRegistryData: {
      entity: 'autobase/road_accident_registry',
    },
    removeOneData: {
      entity: 'autobase/road_accident_registry',
      uniqKeyLikeQueryString: false,
    },
  };

  if (car_id) {
    Service.getRegistryData.payload = {
      car_id,
    };

    Service.getBlobData = {
      entity: 'autobase/road_accident_registry',
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
      title: 'Реестр ДТП',
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
          valueKey: 'accident_date',
          title: 'Дата',
          type: 'advanced-date',
        },
        {
          valueKey: 'driver_fio',
          title: 'Водитель',
          type: 'multiselect',
        },
        {
          valueKey: 'cause_name',
          title: 'Причина ДТП',
          type: 'multiselect',
        },
        {
          valueKey: 'accident_place',
          title: 'Место ДТП',
          type: 'multiselect',
        },
        {
          valueKey: 'is_guilty',
          title: 'Виновность',
          type: 'multiselect',
        },
        {
          valueKey: 'damage_price',
          title: 'Стоимость ущерба, руб.',
          type: 'advanced-number',
        },
        {
          valueKey: 'comment',
          title: 'Примечание',
          type: 'advanced-string-like',
        },
      ],
    },
    list: {
      permissions: roadAccidentPermissions,
      data: {
        uniqKey: 'id',
        fixedWidth: true,
        uniqKeyForParams: 'road_accident_registry_id',
      },
      meta: {
        fields: [
          {
            key: 'enumerated',
            title: '№',
            width: 200,
          },
          {
            key: 'accident_date',
            title: 'Дата',
            format: 'date',
            width: 100,
          },
          {
            key: 'driver_fio',
            title: 'Водитель',
            format: 'road_accident_driver_fio',
            width: 200,
          },
          {
            key: 'cause_name',
            title: 'Причина ДТП',
            width: 200,
          },
          {
            key: 'accident_place',
            title: 'Место ДТП',
            width: 150,
          },
          {
            key: 'is_guilty',
            title: 'Виновность',
            format: 'boolean',
            width: 150,
          },
          {
            key: 'damage_price',
            title: 'Стоимость ущерба, руб.',
            width: 200,
          },
          {
            key: 'comment',
            title: 'Примечание',
            width: 200,
          },
        ],
      },
    },
  };
};
