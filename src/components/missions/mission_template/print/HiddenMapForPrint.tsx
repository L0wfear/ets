import * as React from 'react';
import RouteInfoMap from 'components/route_new/route-info/map/RouteInfoMap';
import { DivNone } from 'global-styled/global-styled';
import { AbsoluteHiddenOverflow } from 'components/missions/mission_template/print/styled/styled';
import { Route } from 'redux-main/reducers/modules/routes/@types/routes.h';

interface IPropsHiddenMapForPrint {
  route: Route;
  printMapKeyBig: string;
  printMapKeySmall: string;
}

class HiddenMapForPrint extends React.PureComponent<IPropsHiddenMapForPrint, {}> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <AbsoluteHiddenOverflow className="map_hidden">
      {
        route
        ? (
          <>
            <RouteInfoMap
              input_lines={route.input_lines}
              object_list={route.object_list}
              type={route.type}
              width="1132px"
              height="1688px"
              mapKey={this.props.printMapKeyBig}
              rotationAngle={Math.PI / 2}
            />
            <RouteInfoMap
              input_lines={route.input_lines}
              object_list={route.object_list}
              type={route.type}
              width="602px"
              height="912px"
              mapKey={this.props.printMapKeySmall}
            />
          </>
        )
        : (
          <DivNone />
        )
      }
      </AbsoluteHiddenOverflow>
    );
  }
}

export default HiddenMapForPrint;
