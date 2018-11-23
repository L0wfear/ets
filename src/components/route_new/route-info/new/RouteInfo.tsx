import * as React from 'react';

import {
  FlexContainer,
  Flex,
} from 'global-styled/global-styled';
import {
  RouteInfoContainerDiv,
  RouteNameDiv,
} from 'components/route_new/route-info/styled/styled';

import RouteInfoMap from 'components/route_new/route-info/map/RouteInfoMap';
import RouteGeoList from 'components/route_new/route-info/geo-list/RouteGeoList';

import {
  PropsRouteInfo,
  StateRouteInfo,
} from 'components/route_new/route-info/RouteInfo.h';

class RouteInfo extends React.PureComponent<PropsRouteInfo, StateRouteInfo> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <RouteInfoContainerDiv>
        <RouteNameDiv none={props.noRouteName}><b>{route.name}</b></RouteNameDiv>
        <FlexContainer isWrap>
          <Flex grow={2} shrink={2} basis={400}>
            <RouteInfoMap
              input_lines={route.input_lines}
              object_list={route.object_list}
              type={route.type}
              mapKey={this.props.mapKey}
            />
          </Flex>
          <Flex grow={1} shrink={1} basis={200}>
            <RouteGeoList
              type={route.type}
              object_list={route.object_list}
              draw_object_list={route.draw_object_list}
            />
          </Flex>
        </FlexContainer>
      </RouteInfoContainerDiv>
    );
  }
}

export default RouteInfo;
