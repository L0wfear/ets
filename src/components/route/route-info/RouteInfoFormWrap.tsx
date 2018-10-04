import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';
import loadable from 'loadable-components';

import { DivNone } from 'global-styled/global-styled';
import { PropsRouteInfoFormWrap } from './RouteInfoForm.h';

const RouteInfoForm = loadable(
  () => import(/* webpackChunkName: "route_info_form" */ 'components/route/route-info/RouteInfoForm'), {
  LoadingComponent,
});

class RouteInfoFormWrap extends React.PureComponent<PropsRouteInfoFormWrap, {}> {
  render() {
    const {
      showForm,
      ...props
    } = this.props;

    return (
      showForm ?
      (
        <RouteInfoForm
          route={props.route}
          title={props.title}
          onHide={props.onHide}
          mapKey={props.mapKey}
        />
      )
      :
      ( <DivNone /> )
    )
  }
}

export default RouteInfoFormWrap;
