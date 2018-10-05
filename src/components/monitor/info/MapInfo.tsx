import * as React from 'react';
import CarInfo from 'components/monitor/info/car-info/CarInfo';
import GeoobjectsInfo from 'components/monitor/info/geoobjects-info/GeoobjectsInfo';

type PropsMapInfo = {
  map: ol.Map,
  centerOn: Function;
};

type StateMapInfo = {

};

class MapInfo extends React.Component<PropsMapInfo, StateMapInfo> {
  render() {
    return (
      <div className="map_info-container">
        <CarInfo {...this.props} />
        <GeoobjectsInfo {...this.props} />
      </div>
    )
  }
}


export default MapInfo;
