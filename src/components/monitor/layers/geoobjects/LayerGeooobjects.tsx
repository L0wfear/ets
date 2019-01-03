import * as React from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { monitorPageAddToSelectedGeoobjects } from 'components/monitor/redux-main/models/actions-monitor-page';
import {
  PropsLayerGeooobjects,
  StateLayerGeooobjects,
} from 'components/monitor/layers/geoobjects/LayerGeooobjects.h';
import {
  diffInputProps,
  renderGeoobjects,
} from 'components/monitor/layers/geoobjects/utils';

class LayerGeooobjects extends React.PureComponent<PropsLayerGeooobjects, StateLayerGeooobjects> {
  componentDidMount() {
    this.props.addLayer({ id: 'GeoObject', zIndex: 0, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);

      renderGeoobjects(this.props.geoobjects, this.props.geoobjects, this.props);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.geoobjects !== prevProps.geoobjects || this.props.SHOW_GEOOBJECTS !== prevProps.SHOW_GEOOBJECTS) {
      const {
        hasDiff,
        diffGeoobjects,
      } = diffInputProps(this.props, prevProps);

      if (hasDiff) {
        renderGeoobjects(prevProps.geoobjects, diffGeoobjects, this.props);
      }
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

export default compose<any, any>(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withLayerProps(),
)(LayerGeooobjects);
