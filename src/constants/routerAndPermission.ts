import monitor from 'components/monitor/config-data';
import coverageReports from 'components/coverage_reports/config-data';
import waybillJournal from 'components/waybill/config-data';
import missions from 'components/missions/config-data';
import nsi from 'components/directories/config-data';
import reports from 'components/reports/config-data';
import programRegistry from 'components/program_registry/config-data';
import notificationRegistry from 'components/notifications/config-data';
import changeCompany from 'components/new/ui/app_header/desktop/right/change_role/config-data';

import dashboard from 'components/new/pages/dashboard/config-data';
import routeList from 'components/new/pages/routes_list/config-data';

const PROTO = window.location.protocol;
const HOST = window.location.host;
const PATHNAME = window.location.pathname;

const routerAndPermission = {
  monitor,
  coverageReports,
  dashboard,
  waybillJournal,
  missions,
  nsi,
  reports,
  routeList,
  notificationRegistry,
  programRegistry,
  admin: {
    path: `${PROTO}//${HOST}${PATHNAME}admin`,
    title: 'Администрирование',
    entyity: 'administration',
    noHash: true,
    noDotList: true,
    noRoute: true,
    checkHidden: (isShow, props) => isShow && !props.isOkrug,
    permissions: {
      list: 'administration',
    },
  },
  changeCompany,
};

const getRouterToPermission = (rAp, level) => {
  return Object.values(rAp).reduce((rtp, val: any) => {
    if (!val.divider) {
      if (!val.children) {
        rtp[val.path] = {
          p: val.permissions.list,
          lvl: level,
        };
      } else {
        rtp = {
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
