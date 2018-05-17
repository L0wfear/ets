import { connect } from 'react-redux';
import OlLayer, { setStyleFeatureByType } from 'components/map/layers/base/OlLayer';
import { getBridgesGeoObjects, getSelectedType } from 'redux/selectors/geoObjects';
import { GEOOBJECTS_TYPES } from 'constants/geoobjects.js';
import { selectGeometry } from 'redux/modules/geoObjects.js';

@connect(
  state => ({
    geoObjects: getBridgesGeoObjects(state),
    bridgesIsSelected: getSelectedType(state) === GEOOBJECTS_TYPES.bridges,
  }),
  {
    selectGeometry,
  },
)
class BridgesLayer extends OlLayer {
  componentDidMount() {
    this.addLayer();
  }

  withState() {
    return {
      bridgesIsSelected: false,
    };
  }
  inheritComponentWillReceiveProps(props) {
    const { bridgesIsSelected: old_value } = this.props;
    const { bridgesIsSelected: new_value } = props;
    if (old_value !== new_value) {

      if (old_value) {
        const { lastSelectedFeature } = this.state;

        lastSelectedFeature.setStyle(setStyleFeatureByType(lastSelectedFeature.get('data').type, lastSelectedFeature));

        this.setState({ lastSelectedFeature: null });
      }
    } else {
      this.updateFeature(props);
    }
  }

  handleSingleClick = featrue => {
    const { lastSelectedFeature } = this.state;
    if (lastSelectedFeature) {
      lastSelectedFeature.setStyle(setStyleFeatureByType(lastSelectedFeature.get('data').type, lastSelectedFeature));
    }

    featrue.setStyle(setStyleFeatureByType(featrue.get('type'), featrue, true));
    this.props.selectGeometry(GEOOBJECTS_TYPES.bridges, featrue.get('data'));

    this.setState({ lastSelectedFeature: featrue });
    return featrue;
  }

  updateFeature(props) {
    const { geoObjects } = props;

    if (geoObjects.length) {
      geoObjects.map(this.addFeature);
    } else {
      this.state.vectorSource.clear();
    }
  }
}

export default BridgesLayer;
