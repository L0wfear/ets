import * as React from 'react';
import Div from 'components/ui/Div.jsx';
import RouteInfo from 'components/route/RouteInfo.jsx';

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
        <RouteInfo route={route} mapOnly keyGlobal={`${props.keyGlobal}/a3`} rotationAngle={Math.PI / 2} />
      </Div>
    </div>
    <div className="a4" >
      <Div hidden={!route}>
        <RouteInfo route={route} mapOnly keyGlobal={`${props.keyGlobal}/a4`} />
      </Div>
    </div>
  </div>
);

export default HiddenMapForPrint;
