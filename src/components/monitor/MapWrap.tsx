import * as React from 'react';
import { connect } from 'react-redux';

import MapEts from 'components/new/ui/map/MapEts';
import LayerGeooobjects from 'components/monitor/layers/geoobjects/LayerGeooobjects';
import LayerSelectedGeooobjects from 'components/monitor/layers/geoobjects/selected/LayerSelectedGeooobjects';
import LayerTrackLines from 'components/monitor/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/monitor/layers/track/points/LayerTrackPoints';
import LayerTrackLinesBySensor from 'components/monitor/layers/track/lines-by-sensor/LayerTrackLinesBySensor';
import LayerParkingPoints from 'components/monitor/layers/track/events/parking/LayerParkingPoints';
import LayerFuelEventPoint from 'components/monitor/layers/track/events/fuel-event/LayerFuelEventPoints';
import LayerPlayPoint from 'components/monitor/layers/track/play-point/LayerPlayPoint';
import LayerCarMarker from 'components/monitor/layers/car-markers/LayerCarMarker';
import LayerFuelEventLeakPoint from 'components/monitor/layers/fuel-event/leak/LayerFuelEventLeakPoint';
import MapInfo from 'components/monitor/info/MapInfo';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

type PropsMapWrap = {
  enableInteractions: boolean;
  disabledCenterOn: boolean;
  disabledMouseSingleClick: boolean;
};

const MapWrap: React.FC<PropsMapWrap> = (props) => (
  <MapEtsConsumer>
  {
    ({ setMapToContext, removeMapToContext }) => (
      <MapEts
        enableInteractions={props.enableInteractions}
        disabledCenterOn={props.disabledCenterOn}
        disabledMouseSingleClick={props.disabledMouseSingleClick}
        setMapToContext={setMapToContext}
        removeMapToContext={removeMapToContext}
        mapKey="monitor"
      >
        {
          ({ map, zoom, centerOn }) => (
            <div>
              <LayerGeooobjects map={map} />
              <LayerSelectedGeooobjects map={map} />
              <LayerTrackLines map={map} />
              <LayerTrackPoints map={map} />
              <LayerTrackLinesBySensor map={map} />
              <LayerParkingPoints map={map} />
              <LayerFuelEventPoint map={map} />
              <LayerPlayPoint map={map} centerOn={centerOn} />
              <LayerCarMarker map={map} zoom={zoom} centerOn={centerOn} />
              <LayerFuelEventLeakPoint map={map} />
              <MapInfo map={map} centerOn={centerOn}/>
            </div>
          )
        }
      </MapEts>
    )
  }
  </MapEtsConsumer>
);

const mapStateToProps = (state) => ({
  enableInteractions: !(!!state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR || state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledCenterOn: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR && !(state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledMouseSingleClick: state.monitorPage.drawActive.all,
});

export default connect(
  mapStateToProps,
)(MapWrap);
