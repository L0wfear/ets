import * as React from 'react';
import LoadingComponent from 'components/ui/PreloaderMainPage';

import { DivNone } from 'global-styled/global-styled';
import { PropsRouteInfoFormWrap } from 'components/route/route-info/RouteInfoForm.h';

const RouteInfoForm = React.lazy(() => (
  import(/* webpackChunkName: "route_info_form" */'components/route/route-info/RouteInfoForm')
));

class RouteInfoFormWrap extends React.PureComponent<PropsRouteInfoFormWrap, {}> {
  render() {
    const {
      showForm,
      ...props
    } = this.props;

    return (
      showForm ?
      (
        <React.Suspense fallback={<LoadingComponent />}>
          <RouteInfoForm
            route={props.route}
            title={props.title}
            onHide={props.onHide}
            mapKey={props.mapKey}
          />
        </React.Suspense>
      )
      :
      ( <DivNone /> )
    );
  }
}

export default RouteInfoFormWrap;
