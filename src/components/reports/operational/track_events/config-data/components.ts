import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

export const component = loadable(() => import(/* webpackChunkName: "track_events" */ '../report'), {
  LoadingComponent,
});

export default [
  {
    component,
    loadable: true,
  },
];