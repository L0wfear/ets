import * as React from 'react';
import RouteInfoMap from 'components/new/pages/routes_list/route-info/map/RouteInfoMap';
import { DivNone } from 'global-styled/global-styled';
import { AbsoluteHiddenOverflow } from 'components/new/pages/missions/mission/form/main/inside_fields/route_id/print/styled/styled';
import { Route } from 'redux-main/reducers/modules/routes/@types';

export type IPropsHiddenMapForPrint = {
  route: Route;
  hiddenMapConfig: Array<{
    printMapKey: string;
    width: string;
    height: string;
    rotationAngle?: number;
  }>;
};

class HiddenMapForPrint extends React.PureComponent<IPropsHiddenMapForPrint, {}> {
  render() {
    const { props } = this;
    const { route } = props;

    return (
      <AbsoluteHiddenOverflow>
        {
          route
            ? (
              props.hiddenMapConfig.map((confData) => (
                <RouteInfoMap
                  key={confData.printMapKey}
                  input_lines={route.input_lines}
                  object_list={route.object_list}
                  type={route.type}
                  width={confData.width}// "1132px" 602px
                  height={confData.height} // "1688px" 912px
                  mapKey={confData.printMapKey}
                  rotationAngle={confData.rotationAngle} // ={Math.PI / 2} 0
                />
              ))
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
