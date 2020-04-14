import * as React from 'react';

import {
  RouteInfoContainerDiv,
  RouteName,
} from 'components/new/pages/routes_list/route-info/styled/styled';

import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';
import RouteGeoList from 'components/new/pages/routes_list/route-info/geo-list/RouteGeoList';

import {
  PropsRouteInfo,
  StateRouteInfo,
} from 'components/new/pages/routes_list/route-info/RouteInfo.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';

class RouteInfo extends React.PureComponent<PropsRouteInfo, StateRouteInfo> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <RouteInfoContainerDiv>
        <RouteName isDisplay={Boolean(!props.noRouteName)}>
          <EtsBootstrap.Col md={8}>
            <EtsBootstrap.Row>
              <EtsBootstrap.Col md={3}>
                <b>Наименование маршрута:</b>
                <div>{route.name}</div>
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <b>Технологическая операция:</b>
                <div>{route.technical_operation_name}</div>
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <b>Элемент:</b>
                <div>{route.municipal_facility_name}</div>
              </EtsBootstrap.Col>
              <EtsBootstrap.Col md={3}>
                <b>Способ уборки:</b>
                <div>{route.work_type_name}</div>
              </EtsBootstrap.Col>
            </EtsBootstrap.Row>
          </EtsBootstrap.Col>
        </RouteName>
        <EtsBootstrap.Col md={12}>
          <EtsBootstrap.Row>
            <EtsBootstrap.Col md={8}>
              <RouteInfoMap
                input_lines={route.input_lines}
                object_list={route.object_list}
                type={route.type}
                height={props.height}
                mapKey={this.props.mapKey}
              />
            </EtsBootstrap.Col>
            <EtsBootstrap.Col md={4}>
              <RouteGeoList
                type={route.type}
                object_list={route.object_list}
                draw_object_list={route.draw_object_list}
                height={props.height}
              />
            </EtsBootstrap.Col>
          </EtsBootstrap.Row>
        </EtsBootstrap.Col>
      </RouteInfoContainerDiv>
    );
  }
}

export default RouteInfo;
