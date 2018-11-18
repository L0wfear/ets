import * as React from 'react';
import RouteInfoMap from 'components/route/route-info/map/RouteInfoMap';
import { DivNone } from 'global-styled/global-styled';
import { AbsoluteHiddenOverflow } from 'components/missions/mission/MissionForm/print/styled/styled';
import { RouteType } from 'redux-main/trash-actions/route/@types/promise.h';

interface IPropsHiddenMapForPrint {
  route: RouteType;
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
              width="1204px"
              height="1824px"
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
