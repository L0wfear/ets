import monitor from 'components/monitor/config-data';
import coverageReports from 'components/coverage_reports/config-data';
import dashboard from 'components/dashboard/config-data/index';
import waybillJournal from 'components/waybill/config-data';
import missions from 'components/missions/config-data';
import nsi from 'components/directories/config-data';
import reports from 'components/reports/config-data';
import routeList from 'components/route/config-data';
import companyStructure from 'components/company_structure/config-data';
import programRegistry from 'components/program_registry/config-data';
import notificationRegistry from 'components/notifications/config-data';
import changeCompany from 'components/nav-item-role/config-data';

const routerAndPermission = {
  monitor,
  coverageReports,
  dashboard,
  waybillJournal,
  missions,
  nsi,
  reports,
  routeList,
  companyStructure,
  notificationRegistry,
  programRegistry,
  admin: {
    path: `http://213.79.88.5/admin`,
    title: 'Администрирование',
    entyity: 'administration',
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
