import * as React from 'react';

import Map from 'components/map/new/Map';

import LayerGeooobjects from 'components/missions/mission/MissionInfoForm/new/map/layers/geoobjects/LayerGeooobjects';
import LayerCarMarker from 'components/missions/mission/MissionInfoForm/new/map/layers/car-markers/LayerCarMarker';

type PropsMapWrap = {
  gov_number: string;
  geoobjects: object;
};

class MapWrap extends React.Component<PropsMapWrap, {}> {
  render() {
    return (
      <Map enableInteractions>
        {
          ({ map, zoom, centerOn }) => (
            <div>
              {
               
                /*
                <LayerTrackLines map={map} />
                <LayerTrackPoints map={map} />
                <LayerParkingPoints map={map} />
                <Legend hasMkad MaxSpeeds />

                */
              }
              <LayerGeooobjects geoobjects={this.props.geoobjects} map={map} centerOn={centerOn}/>
              <LayerCarMarker gov_number={this.props.gov_number} map={map}/>
            </div>
          )
        }
      </Map>
    );
  }
}
  
export default MapWrap;
