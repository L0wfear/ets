import React from 'react';
import Map from 'components/map/Map.jsx';

export default class MapWrapper extends React.Component {

  constructor() {
    super();
  }

  onFeatureClick(feature, event, map) {
    const featureData = feature.getProperties().data;
    const { flux } = this.props;
    let pointsStore = flux.getStore('points');
    let geoObjectsStore = flux.getStore('geoObjects');
    pointsStore.handleSelectPoint(false);
    geoObjectsStore.handleSelectFeature(featureData);
  }

  render() {
    return (
      <div>
        <Map
          onFeatureClick={this.onFeatureClick.bind(this)}
          {...this.props}/>
      </div>
    );
  }

}
