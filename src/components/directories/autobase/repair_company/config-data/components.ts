import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "repair_company" */ 'components/directories/autobase/repair_company/RepairCompanyList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
