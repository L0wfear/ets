/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "order" *//* 'components/directories/order/OrderList'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/directories/order/OrderList';

export default [
  {
    component,
  },
];
