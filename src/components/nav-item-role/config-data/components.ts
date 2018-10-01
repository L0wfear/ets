import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "cahnge_company" */ 'components/nav-item-role/CahngeCompany'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
