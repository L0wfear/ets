import * as React from 'react';

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
  renderGeoobjects,
} from 'components/monitor/layers/geoobjects/utils';

class LayerGeooobjects extends React.Component<PropsLayerGeooobjects, StateLayerGeooobjects> {
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.props.geoobjects, this.props.geoobjects, this.props);
    });
  }

  componentDidUpdate(prevProps) {
    const {
      hasDiff,
      diffGeoobjects,
    } = diffInputProps(this.props, prevProps);

    if (hasDiff) {
      renderGeoobjects(prevProps.geoobjects, diffGeoobjects, this.props);
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
      this.props.geoobjects[serverName].data[id],
    );
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
  ),
});

export default hocAll(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerGeooobjects);
