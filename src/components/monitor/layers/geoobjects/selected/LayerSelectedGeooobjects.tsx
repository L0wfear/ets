import * as React from 'react';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';
import { monitorPageRemoveFromSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';

import {
  PropsLayerSelectedGeooobjects,
  StateLayerSelectedGeooobjects,
} from 'components/monitor/layers/geoobjects/selected/LayerSelectedGeooobjects.h';
import {
  renderGeoobjects,
} from 'components/monitor/layers/geoobjects/selected/utils';

class LayerSelectedGeooobjects extends React.Component<PropsLayerSelectedGeooobjects, StateLayerSelectedGeooobjects> {
  state = {
    selectedGeoobjects: this.props.selectedGeoobjects,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'SelectedGeoObject', zIndex: 1 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.state.selectedGeoobjects, this.props.selectedGeoobjects, this.props);
    });
  }

  componentWillReceiveProps(nextProps: PropsLayerSelectedGeooobjects) {
    const { selectedGeoobjects } = nextProps;

    renderGeoobjects(this.state.selectedGeoobjects, selectedGeoobjects, this.props);
    this.setState({
      selectedGeoobjects,
    });
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature: ol.Feature) => {
    this.props.monitorPageRemoveFromSelectedGeoobjects(
      feature.get('serverName'),
      (feature as any).getId(),
    );
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = state => ({
  selectedGeoobjects: state.monitorPage.selectedGeoobjects,
});

const mapDispatchToProps = dispatch => ({
  monitorPageRemoveFromSelectedGeoobjects: (serverName, id) => (
    dispatch(
      monitorPageRemoveFromSelectedGeoobjects(
        serverName,
        id,
      )
    )
  )
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerSelectedGeooobjects);
