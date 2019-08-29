import * as React from 'react';
import styled from 'styled-components';

import MapEts from 'components/new/ui/map/MapEts';
import LayerTrackLines from 'components/old/monitor/layers/track/lines/LayerTrackLines';
// import LayerTrackPoints from 'components/old/monitor/layers/track/points/LayerTrackPoints';
import LayerTrackLinesBySensor from 'components/old/monitor/layers/track/lines-by-sensor/LayerTrackLinesBySensor';
import LayerParkingPoints from 'components/old/monitor/layers/track/events/parking/LayerParkingPoints';
import LayerFuelEventPoint from 'components/old/monitor/layers/track/events/fuel-event/LayerFuelEventPoints';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

const Container = styled.div<{ width?: number; height?: number}>`
  position: absolute;
  z-index: -1;
  width: ${({ width }) => `${width || 1920}px`};
  height: ${({ height }) => `${height || 1080}px`};
`;

type PropsMapWrap = {
  mapKey: string;

  width?: number;
  height?: number;
};

const HiddenMapCarExport: React.FC<PropsMapWrap> = React.memo(
  (props) => (
    <Container width={props.width} height={props.height}>
      <MapEtsConsumer>
      {
        ({ setMapToContext, removeMapToContext }) => (
          <MapEts
            enableInteractions
            disabledCenterOn={false}
            disabledMouseSingleClick={false}
            setMapToContext={setMapToContext}
            removeMapToContext={removeMapToContext}
            mapKey={props.mapKey}
          >
            {
              ({ map, centerOn }) => (
                <div>
                  <LayerTrackLines map={map} needCenterOnAfterUpdate centerOn={centerOn} />
                  {/* <LayerTrackPoints map={map} /> */}
                  <LayerTrackLinesBySensor map={map} />
                  <LayerParkingPoints map={map} />
                  <LayerFuelEventPoint map={map} />
                </div>
              )
            }
          </MapEts>
        )
      }
      </MapEtsConsumer>
    </Container>
  ),
);

export default HiddenMapCarExport;
