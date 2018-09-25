import * as React from 'react';
import Div from 'components/ui/Div';
import RouteInfo from 'components/route/RouteInfo';

require('components/missions/mission_template/print/HiddenMapForPrint.scss');

interface IPropsHiddenMapForPrint {
  route: any;
  printFormat: string;
  keyGlobal: string;
}

const HiddenMapForPrint: React.SFC<IPropsHiddenMapForPrint> = ({ route, ...props }) => (
  <div className="hidden_map">
    <div className="a3">
      <Div hidden={!route}>
        <RouteInfo route={route} mapOnly keyGlobal={`${props.keyGlobal}/a3`} rotationAngle={Math.PI / 2} onlyMap />
      </Div>
    </div>
    <div className="a4" >
      <Div hidden={!route}>
        <RouteInfo route={route} mapOnly keyGlobal={`${props.keyGlobal}/a4`} onlyMap />
      </Div>
    </div>
  </div>
);

export default HiddenMapForPrint;
