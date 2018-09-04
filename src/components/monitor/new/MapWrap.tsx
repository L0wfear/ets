import * as React from 'react';
import { connect } from 'react-redux';

import Map from 'components/map/new/Map';
import LayerTrackLines from 'components/map/new/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/map/new/layers/track/points/LayerTrackPoints';
import LayerCarMarker from 'components/map/new/layers/car-markers/LayerCarMarker';
import MapInfo from 'components/monitor/new/info/MapInfo';
import LayerPlayPoint from 'components/map/new/layers/track/play-point/LayerPlayPoint';
import LayerParkingPoints from 'components/map/new/layers/track/events/parking/LayerParkingPoints';
import LayerTrackLinesBySensor from 'components/map/new/layers/track/lines-by-sensor/LayerTrackLinesBySensor';
import LayerFuelEventPoint from 'components/map/new/layers/track/events/fuel-event/LayerFuelEventPoints';
import LayerGeooobjects from 'components/map/new/layers/geoobjects/LayerGeooobjects';
import LayerSelectedGeooobjects from 'components/map/new/layers/geoobjects/selected/LayerSelectedGeooobjects';
import LayerMeasure from 'components/map/new/layers/measure/LayerMeasure';
import LayerFuelEventLeakPoint from 'components/map/new/layers/fuel-event/leak/LayerFuelEventLeakPoint';

type PropsMapWrap = {
  disabledByType: any;
  enableInteractions: boolean;
  disabledCenterOn: boolean;
  disabledouseSingleClick: boolean;
};

const MapWrap: React.SFC<PropsMapWrap> = (props) => (
  <Map disabledByType={props.disabledByType} enableInteractions={props.enableInteractions} disabledCenterOn={props.disabledCenterOn} disabledouseSingleClick={props.disabledouseSingleClick}>
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
  </Map>
);

const mapStateToProps = state => ({
  disabledByType: state.monitorPage.carInfo.statusTC,
  enableInteractions: !(!!state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR || state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledCenterOn: state.monitorPage.carInfo.statusTC.FOLLOW_ON_CAR && !(state.monitorPage.carInfo.playTrack.status === 'play'),
  disabledouseSingleClick: state.monitorPage.measureActive,
});

export default connect(
  mapStateToProps,
)(MapWrap);
