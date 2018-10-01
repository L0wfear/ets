import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "company_tructure" */ 'components/company_structure/CompanyStructure'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
