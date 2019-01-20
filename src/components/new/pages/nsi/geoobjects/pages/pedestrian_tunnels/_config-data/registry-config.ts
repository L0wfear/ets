import { GeozonePedestrianTunnelsService } from 'api/Services';

import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/hoc/withRegistry.h';
import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnels/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';

export const registryKey = 'PedestrianTunnelsList';

export const config: TypeConfigData = {
  Service: GeozonePedestrianTunnelsService,
  registryKey,
  header: {
    title: 'Пункты временного складирования снега',
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
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
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
          width: 400,
        },
        {
          key: 'adm_area',
          title: 'Административный округ',
          width: 400,
        },
        {
          key: 'district',
          title: 'Район',
          width: 400,
        },
        {
          key: 'location',
          title: 'Адресный ориентир',
          width: 400,
        },
      ],
    },
  },
};
