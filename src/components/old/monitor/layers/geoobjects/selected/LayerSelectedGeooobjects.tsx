import * as React from 'react';
import Feature from 'ol/Feature';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/old/monitor/redux-main/models/actions-monitor-page';

import {
  PropsLayerSelectedGeooobjects,
  StateLayerSelectedGeooobjects,
} from 'components/old/monitor/layers/geoobjects/selected/LayerSelectedGeooobjects.h';
import {
  renderGeoobjects,
} from 'components/old/monitor/layers/geoobjects/selected/utils';

class LayerSelectedGeooobjects extends React.PureComponent<PropsLayerSelectedGeooobjects, StateLayerSelectedGeooobjects> {
  componentDidMount() {
    this.props.addLayer({ id: 'SelectedGeoObject', zIndex: 1, renderMode: 'hybrid' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.props.selectedGeoobjects, this.props.selectedGeoobjects, this.props);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedGeoobjects !== prevProps.selectedGeoobjects) {
      renderGeoobjects(prevProps.selectedGeoobjects, this.props.selectedGeoobjects, this.props);
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature: Feature) => {
    this.props.monitorPageRemoveFromSelectedGeoobjects(
      feature.get('serverName'),
      (feature as any).getId(),
    );
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({
  selectedGeoobjects: state.monitorPage.selectedGeoobjects,
});

const mapDispatchToProps = (dispatch) => ({
  monitorPageRemoveFromSelectedGeoobjects: (serverName, id) => (
    dispatch(
      monitorPageRemoveFromSelectedGeoobjects(
        serverName,
        id,
      ),
    )
  ),
});

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerSelectedGeooobjects);
