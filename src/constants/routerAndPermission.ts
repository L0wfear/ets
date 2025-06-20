import monitor from 'components/old/monitor/config-data';
import coverageReports from 'components/old/coverage_reports/config-data';
import reports from 'components/old/reports/config-data';
import notificationRegistry from 'components/old/notifications/config-data';
import changeCompany from 'components/new/ui/app_header/desktop/right/change_role/config-data';

import missions from 'components/new/pages/missions/_config-data';
import dashboard from 'components/new/pages/dashboard/config-data';
import inspection from 'components/new/pages/inspection/_config_data';
import edcRequest from 'components/new/pages/edc_request/_config-data';
import nsi from 'components/new/pages/nsi/_config-data';
import routeList from 'components/new/pages/routes_list/config-data';
import programRegistryList from 'components/new/pages/program_registry/_config-data';
import waybillList from 'components/new/pages/waybill/_config-data';
import administration from 'components/new/pages/administration/_config-data';
import { ConfigPageData, ConfigParentData } from 'components/@next/@types/config_data';

const routerAndPermission: { [k: string]: ConfigPageData | ConfigParentData; } = {
  monitor,
  coverageReports,
  dashboard,
  inspection,
  waybillList,
  missions,
  edcRequest,
  nsi,
  reports,
  routeList,
  notificationRegistry,
  programRegistryList,
  administration,
  changeCompany,
};

const getRouterToPermission = (rAp, level) => {
  return Object.values(rAp).reduce((rtp: any, val: any) => {
    if (!val.divider) {
      if (!val.children) {
        rtp[val.routePath || val.path] = {
          p: val.permissions.list,
          lvl: level,
        };
      } else {
        return {
          ...rtp,
          ...getRouterToPermission(val.children, level + 1),
        };
      }
    }
    return rtp;
  },
  {});
};

const routToPer = getRouterToPermission(routerAndPermission, 1);

export default routerAndPermission;
export {
  routToPer,
};
