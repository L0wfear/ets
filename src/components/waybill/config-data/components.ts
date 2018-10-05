/*
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "waybill" *//* 'components/waybill/config-data/WaybillJournalWrap'), {
  LoadingComponent,
})

export default [
  {
    component,
    loadable: true,
  },
];
*/

import component from 'components/waybill/config-data/WaybillJournalWrap';

export default [
  {
    component,
  },
];
