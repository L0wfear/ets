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

  onFeatureClick(feature, isNeedCloseSidebar) {
    const featureData = feature.getProperties().data;

    const nameOfSelectedFeature = ((type) => {
      switch (type) {
        case 'leak': return 'selectedFeatureLeak';
        default: return 'selectedFeature';
      }
    })(featureData.featureType);

    const { flux } = this.props;
    const pointsStore = flux.getStore('points');
    const geoObjectsStore = flux.getStore('geoObjects');
    if (isNeedCloseSidebar) {
      pointsStore.handleSelectPoint(false);
    }
    geoObjectsStore.handleSelectFeature(featureData, nameOfSelectedFeature);
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
