import buttonsTypes from 'components/new/ui/registry/contants/buttonsTypes';
import { TypeConfigData } from 'components/new/ui/registry/module/@types/registry';
import permissions from 'components/new/pages/nsi/geoobjects/pages/pedestrian_tunnel_exits/_config-data/permissions';
import { displayIfContant } from 'components/new/ui/registry/contants/displayIf';
import { PedestrianTunnelExits } from 'redux-main/reducers/modules/geoobject/actions_by_type/pedestrian_tunnel_exits/@types';
import { gormost } from 'redux-main/reducers/modules/geoobject/constants';

export const registryKey = 'PedestrianTunnelExitsList';

export const config: TypeConfigData<PedestrianTunnelExits> = {
  Service: {
    getRegistryData: {
      entity: `geozones/${gormost.pedestrian_tunnel_exits}`,
    },
  },
  registryKey,
  header: {
    title: 'Справочник выходов из пешеходных тоннелей',
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
    ],
  },
  list: {
    permissions,
    data: {
      uniqKey: 'id',
      fixedWidth: true,
      uniqKeyForParams: 'pedestrian_tunnel_exits_id',
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
          width: 200,
        },
        {
          key: 'adm_area',
          title: 'Административный округ',
          width: 300,
        },
        {
          key: 'district',
          title: 'Район',
          width: 150,
        },
      ],
    },
  },
};
