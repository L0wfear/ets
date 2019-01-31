import * as React from 'react';

import {
  RouteInfoContainerDiv,
  RouteNameCol,
} from 'components/route/route-info/styled/styled';
import { Col, Row } from 'react-bootstrap';

import RouteInfoMap from 'components/route/route-info/map/RouteInfoMap';
import RouteGeoList from 'components/route/route-info/geo-list/RouteGeoList';

import {
  PropsRouteInfo,
  StateRouteInfo,
} from 'components/route/route-info/RouteInfo.h';

class RouteInfo extends React.PureComponent<PropsRouteInfo, StateRouteInfo> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <RouteInfoContainerDiv>
        <RouteNameCol none={props.noRouteName} md={8}>
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
        </RouteNameCol>
        <Col md={12}>
          <Row>
            <Col md={8}>
              <RouteInfoMap
                input_lines={route.input_lines}
                object_list={route.object_list}
                type={route.type}
                mapKey={this.props.mapKey}
              />
            </Col>
            <Col md={4}>
              <RouteGeoList
                type={route.type}
                object_list={route.object_list}
                draw_object_list={route.draw_object_list}
              />
            </Col>
          </Row>
        </Col>
      </RouteInfoContainerDiv>
    );
  }
}

export default RouteInfo;
