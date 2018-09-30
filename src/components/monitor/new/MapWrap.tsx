import * as React from 'react';
import { connect } from 'react-redux';

import MapEts from 'components/map/new/MapEts';
import LayerGeooobjects from 'components/map/new/layers/geoobjects/LayerGeooobjects';
import LayerSelectedGeooobjects from 'components/map/new/layers/geoobjects/selected/LayerSelectedGeooobjects';
import LayerTrackLines from 'components/map/new/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/map/new/layers/track/points/LayerTrackPoints';
import LayerTrackLinesBySensor from 'components/map/new/layers/track/lines-by-sensor/LayerTrackLinesBySensor';
import LayerParkingPoints from 'components/map/new/layers/track/events/parking/LayerParkingPoints';
import LayerFuelEventPoint from 'components/map/new/layers/track/events/fuel-event/LayerFuelEventPoints';
import LayerPlayPoint from 'components/map/new/layers/track/play-point/LayerPlayPoint';
import LayerCarMarker from 'components/map/new/layers/car-markers/LayerCarMarker';
import LayerMeasure from 'components/map/new/layers/measure/LayerMeasure';
import LayerFuelEventLeakPoint from 'components/map/new/layers/fuel-event/leak/LayerFuelEventLeakPoint';
import MapInfo from 'components/monitor/new/info/MapInfo';

import { MapEtsConsumer } from 'components/map/new/context/MapetsContext';

type PropsMapWrap = {
  disabledByType: any;
  enableInteractions: boolean;
  disabledCenterOn: boolean;
  disabledMouseSingleClick: boolean;
};

const MapWrap: React.SFC<PropsMapWrap> = (props) => (
  <MapEtsConsumer>
  {
    ({ setMapToContext, removeMapToContext }) => (
      <MapEts
        disabledByType={props.disabledByType}
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
              <LayerMeasure map={map} />
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

const mapStateToProps = state => ({
  disabledByType: state.monitorPage.carInfo.statusTC,
  enableInteractions: !(!!state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR || state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledCenterOn: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR && !(state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledMouseSingleClick: state.monitorPage.measureActive,
});

export default connect(
  mapStateToProps,
)(MapWrap);
