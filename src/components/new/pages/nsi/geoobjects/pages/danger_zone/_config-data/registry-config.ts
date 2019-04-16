import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/danger_zone/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { DangerZone } from 'redux-main/reducers/modules/geoobject/actions_by_type/danger_zone/@types';
import { geoozones } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'DangerZoneList';

export const config: TypeConfigData<DangerZone> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${geoozones.danger_zone}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник особо опасных мест',
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
        title: 'Наименование ОДХ',
        type: 'multiselect',
      },
      {
        valueKey: 'address_comm',
        title: 'Адресная привязка',
        type: 'multiselect',
      },
      {
        valueKey: 'roadway_area',
        title: 'Площадь на проезжей части, м²',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'sidewalk_area',
        title: 'Площадь на тротуаре, м²',
        type: 'advanced-number',
        step: 0.01,
      },
      {
        valueKey: 'sidelines_area',
        title: 'Площадь на обочинах, м²',
        type: 'advanced-number',
        step: 0.01,
      },
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'danger_zone_id',
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
          title: 'Наименование ОДХ',
          width: 200,
        },
        {
          key: 'address_comm',
          title: 'Адресная привязка',
          width: 200,
        },
        {
          key: 'roadway_area',
          title: 'Площадь на проезжей части, м²',
          format: 'toFixed2',
          width: 300,
        },
        {
          key: 'sidewalk_area',
          title: 'Площадь на тротуаре, м²',
          format: 'toFixed2',
          width: 250,
        },
        {
          key: 'sidelines_area',
          title: 'Площадь на обочинах, м²',
          format: 'toFixed2',
          width: 250,
        },
      ],
    },
  },
};
