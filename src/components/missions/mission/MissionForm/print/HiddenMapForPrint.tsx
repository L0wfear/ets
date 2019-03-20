import * as React from 'react';
import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';
import { DivNone } from 'global-styled/global-styled';
import { AbsoluteHiddenOverflow } from 'components/missions/mission/MissionForm/print/styled/styled';
import { Route } from 'redux-main/reducers/modules/routes/@types';

interface IPropsHiddenMapForPrint {
  route: Route;
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
              width="602px"
              height="912px"
              mapKey={this.props.printMapKeySmall}
              rotationAngle={Math.PI / 2}
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
