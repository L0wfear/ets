import React, { PropTypes } from 'react';
import Map from 'components/map/Map.jsx';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

@connect(
  state => state.types
)
@autobind
export default class MapWrapper extends React.Component {

  static get propTypes() {
    return {
      flux: PropTypes.object,
    };
  }

  onFeatureClick(feature) {
    const featureData = feature.getProperties().data;
    const fuelOrObject = (featureData.featureType === 'leak') ? 'selectedFeatureFuels' : 'selectedFeatureObjects';
    const { flux } = this.props;
    const pointsStore = flux.getStore('points');
    const geoObjectsStore = flux.getStore('geoObjects');
    pointsStore.handleSelectPoint(false);
    geoObjectsStore.handleSelectFeature(featureData, fuelOrObject);
  }

  render() {
    return (
      <Map
        onFeatureClick={this.onFeatureClick}
        {...this.props}
      />
    );
  }

}
