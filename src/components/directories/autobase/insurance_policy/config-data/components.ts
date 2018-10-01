import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "insurance_policy" */ 'components/directories/autobase/insurance_policy/InsurancePolicyList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
