import * as React from 'react';
import * as ol from 'openlayers';

import hocAll from 'components/compositions/vokinda-hoc/recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';
import { monitorPageAddToSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';
import {
  PropsLayerGeooobjects,
  StateLayerGeooobjects,
} from 'components/monitor/layers/geoobjects/LayerGeooobjects.h';
import {
  diffInputProps,
  getMergedGeoobjects,
  renderGeoobjects,
} from 'components/monitor/layers/geoobjects/utils';

class LayerGeooobjects extends React.Component<PropsLayerGeooobjects, StateLayerGeooobjects> {
  state = {
    geoobjects: this.props.geoobjects,
    SHOW_GEOOBJECTS: this.props.SHOW_GEOOBJECTS,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.state.geoobjects, this.state.geoobjects, this.props);
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      hasDiff,
      diffGeoobjects,
    } = diffInputProps(nextProps, this.state);
    
    if (hasDiff) {
      renderGeoobjects(this.state.geoobjects, diffGeoobjects, nextProps);
      this.setState({
        geoobjects: getMergedGeoobjects(this.state.geoobjects, diffGeoobjects),
        SHOW_GEOOBJECTS: nextProps.SHOW_GEOOBJECTS,
      })
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  singleclick = (feature: ol.Feature) => {
    const serverName = feature.get('serverName');
    const id = feature.getId();

    this.props.monitorPageAddToSelectedGeoobjects(
      serverName,
      id,
      this.state.geoobjects[serverName].data[id],
    )
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({
  companiesIndex: state.monitorPage.companiesIndex,
  geoobjects: state.monitorPage.geoobjects,
  SHOW_GEOOBJECTS: state.monitorPage.statusGeo.SHOW_GEOOBJECTS,
});
const mapDispatchToProps = (dispatch) => ({
  monitorPageAddToSelectedGeoobjects: (serverName, id, data) => (
    dispatch(
      monitorPageAddToSelectedGeoobjects(
        serverName,
        id,
        data,
      ),
    )
  )
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerGeooobjects);
