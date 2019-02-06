import * as React from 'react';

import {
  RouteInfoContainerDiv,
  RouteName,
} from 'components/new/pages/routes_list/route-info/styled/styled';

import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';
import RouteGeoList from 'components/new/pages/routes_list/route-info/geo-list/RouteGeoList';
import { Col, Row } from 'react-bootstrap';

import {
  PropsRouteInfo,
  StateRouteInfo,
} from 'components/new/pages/routes_list/route-info/RouteInfo.h';

class RouteInfo extends React.PureComponent<PropsRouteInfo, StateRouteInfo> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <RouteInfoContainerDiv>
        <RouteName isDisplay={Boolean(!props.noRouteName)}>
          <Col md={8}>
            <Row>
              <Col md={4}>
                <div>Наименование маршрута:</div>
                <b>{route.name}</b>
              </Col>
              <Col md={4}>
                <div>Технологическая операция:</div>
                <b>{route.technical_operation_name}</b>
              </Col>
              <Col md={4}>
                <div>Элемент:</div>
                <b>{route.municipal_facility_name}</b>
              </Col>
            </Row>
          </Col>
        </RouteName>
        <Col md={12}>
          <Row>
            <Col md={8}>
              <RouteInfoMap
                input_lines={route.input_lines}
                object_list={route.object_list}
                type={route.type}
                height={props.height}
                mapKey={this.props.mapKey}
              />
            </Col>
            <Col md={4}>
              <RouteGeoList
                type={route.type}
                object_list={route.object_list}
                draw_object_list={route.draw_object_list}
                height={props.height}
              />
            </Col>
          </Row>
        </Col>
      </RouteInfoContainerDiv>
    );
  }
}

export default RouteInfo;
