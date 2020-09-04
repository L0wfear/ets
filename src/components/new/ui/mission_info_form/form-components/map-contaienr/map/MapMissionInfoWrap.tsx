
import * as React from 'react';

import MapEts from 'components/new/ui/map/MapEts';

import LayerMissionGeoobject from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/geoobjects/LayerMissionGeoobject';
import LayerCarMarker from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/car-markers/LayerCarMarker';
import LayerTrackLines from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/lines/LayerTrackLines';
import LayerTrackPoints from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/points/LayerTrackPoints';
import LayerParkingPoints from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/layers/track/events/parking/LayerParkingPoints';

import { PropsMapMissionInfoWrap } from 'components/new/ui/mission_info_form/form-components/map-contaienr/map/MapMissionInfoWrap.h';

import { MapEtsConsumer } from 'components/new/ui/map/context/MapetsContext';

class MapWrap extends React.PureComponent<PropsMapMissionInfoWrap, {}> {
  render() {
    const {
      gov_number,
      gps_code,
    } = this.props;

    return (
      <MapEtsConsumer>
        {
          ({ setMapToContext, removeMapToContext }) => (
            <MapEts
              enableInteractions
              setMapToContext={setMapToContext}
              removeMapToContext={removeMapToContext}
              mapKey="missionInfoForm"
            >
              {
                ({ map, centerOn }) => (
                  <React.Fragment>
                    <LayerMissionGeoobject geoobjects={this.props.geoobjects} inputLines={this.props.inputLines} map={map} centerOn={centerOn}/>
                    <LayerTrackLines map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} />
                    <LayerTrackPoints map={map} track={this.props.track} mkad_speed_lim={this.props.mkad_speed_lim} speed_lim={this.props.speed_lim} gov_number={gov_number} cars_sensors={this.props.cars_sensors} car_id={this.props.car_id} missionNumber={this.props.missionNumber}/>
                    <LayerParkingPoints map={map} front_parkings={this.props.parkings} />
                    <LayerCarMarker gps_code={gps_code} map={map} track={this.props.track} />
                  </React.Fragment>
                )
              }
            </MapEts>
          )
        }
      </MapEtsConsumer>

    );
  }
}

export default MapWrap;
