import monitor from 'components/old/monitor/config-data';
import coverageReports from 'components/old/coverage_reports/config-data';

import missions from 'components/new/pages/missions/_config-data';
import dashboard from 'components/new/pages/dashboard/config-data';
import inspection from 'components/new/pages/inspection/_config_data';
import edcRequest from 'components/new/pages/edc_request/_config-data';
import waybillList from 'components/new/pages/waybill/_config-data';

const routerAndPermission = {
  monitor,
  coverageReports,
  dashboard,
  inspection,
  waybillList,
  missions,
  edcRequest,
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
