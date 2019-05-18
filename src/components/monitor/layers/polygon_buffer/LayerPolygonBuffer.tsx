import * as React from 'react';
import { omit } from 'lodash';

import { connect } from 'react-redux';
import EtsBootstrap from 'components/new/ui/@bootstrap';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import {
  monitorPageTogglePolygonBufferActive,
  monitorPageFalsePolygonBufferActive,
  monitorPageChangeFilter,
} from 'components/monitor/redux-main/models/actions-monitor-page';
import { compose } from 'recompose';
import { getStyleForPolygonBuffer } from 'components/monitor/layers/polygon_buffer/feature-style';
import * as jsts from 'jsts';

import Feature from 'ol/Feature';
import { geoJSON } from 'utils/ol';
import LayerDraw from 'components/new/ui/map/layers/default/layer-draw/LayerDraw';
import { ReduxState } from 'redux-main/@types/state';
import { getMonitorPageState } from 'redux-main/reducers/selectors';

import {
  ButtonContainer,
  ButtonDraw,
} from 'components/monitor/layers/polygon_buffer/styled/styled';

const createBuffer = (feature: Feature, distance, options: any = {}) => {
  const ns_buffer = (jsts as any).operation.buffer.BufferParameters;

  const reader = new jsts.io.GeoJSONReader();
  const inputGeometry = reader.read(geoJSON.writeFeatureObject(feature));
  const inputGeometryBuffer = (inputGeometry as any).geometry.buffer(distance, ns_buffer.DEFAULT_QUADRANT_SEGMENTS, ns_buffer.CAP_ROUND);
  const geometrybufferGeoJSON = new jsts.io.GeoJSONWriter().write(inputGeometryBuffer);

  return geometrybufferGeoJSON;
};

type PropsLayerPolygonBuffer = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  getVectorSource: ETSCore.Map.InjectetLayerProps.FuncGetVectorSource,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  map: ol.Map;

  monitorPageTogglePolygonBufferActive: any;
  monitorPageFalsePolygonBufferActive: any;
  monitorPageChangeFilter: any;
  drawActivePolygonBuffer: boolean;
  drawActiveAll: boolean;

  featureBufferPolygon: Feature | null;
};

type StateLayerPolygonBuffer = {
  interactionDraw: ol.interaction.Draw | void;
  activeDraw: boolean;
};

/**
 * @todo перевести на LayerLayerDraw
 */
class LayerPolygonBuffer extends React.PureComponent<PropsLayerPolygonBuffer, StateLayerPolygonBuffer> {
  state = {
    interactionDraw: null,
    activeDraw: false,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'PolygonBufferLines', zIndex: 99, renderMode: 'image' }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);
    });
    const featureBufferPolygon = localStorage.getItem('featureBufferPolygon');
    const qwe = featureBufferPolygon ? JSON.parse(featureBufferPolygon) : null;
    this.drawBufferToMap(qwe);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.featureBufferPolygon !== this.props.featureBufferPolygon) {
      if (prevProps.featureBufferPolygon) {
        this.props.removeFeaturesFromSource(null, true); // удаляет буфер
      }
      if (this.props.featureBufferPolygon) {
        const newFeature: any = new Feature({
          geometry: geoJSON.readGeometry(this.props.featureBufferPolygon),
        });
        newFeature.set('notSelected', true);
        newFeature.setStyle(getStyleForPolygonBuffer());
        this.props.addFeaturesToSource(newFeature);
        this.props.monitorPageFalsePolygonBufferActive(); // отображение буфера на карте
      }
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
    if (this.props.drawActivePolygonBuffer) {
      this.props.monitorPageFalsePolygonBufferActive();
    }
  }

  drawBufferToMap(qwe: any) {
    const newFeature: any = new Feature({
      geometry: geoJSON.readGeometry(qwe),
    });

    newFeature.set('notSelected', true);
    newFeature.setStyle(getStyleForPolygonBuffer());

    this.props.addFeaturesToSource(newFeature); // Если нужно посмотреть прям сейчас
    this.props.monitorPageChangeFilter('featureBufferPolygon', qwe);
  }

  toggleMeasureActive = () => {
    this.props.monitorPageTogglePolygonBufferActive();
    if (!this.props.drawActivePolygonBuffer) {
      this.props.removeFeaturesFromSource(null, true);
    }
  }

  handleClickRemove = () => {
    this.props.removeFeaturesFromSource(null, true);
    this.props.monitorPageChangeFilter('featureBufferPolygon', null);
    localStorage.setItem('featureBufferPolygon', '');
  }

  handleStartDraw = () => {
    this.setState({ activeDraw: true });
    this.handleClickRemove();
  }

  handleEndDraw = (feature: ol.Feature) => { // конец рисования буфера
    const buffer = createBuffer(feature, 1000);
    this.drawBufferToMap(buffer);
    this.setState({ activeDraw: false });
    this.props.monitorPageFalsePolygonBufferActive();

    if (buffer) {
      localStorage.setItem('featureBufferPolygon', JSON.stringify(buffer));
    }
  }

  render() {
    return (
      <>
        <ButtonContainer>
          <ButtonDraw disabled={this.state.activeDraw } onClick={this.toggleMeasureActive} />
          <EtsBootstrap.Button disabled={this.state.activeDraw || !this.props.featureBufferPolygon} onClick={this.handleClickRemove}>
            <EtsBootstrap.Glyphicon glyph="remove" />
          </EtsBootstrap.Button>
        </ButtonContainer>
        <LayerDraw
          map={this.props.map}
          type="Polygon"
          inDraw={this.props.drawActivePolygonBuffer}
          handleStartDraw={this.handleStartDraw}
          handleEndDraw={this.handleEndDraw}
          styles={getStyleForPolygonBuffer()}
        />
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  drawActiveAll: Object.values(omit({...state.monitorPage.drawActive}, ['all', 'polygonBuffer'])).some((value: boolean) => value),
  drawActivePolygonBuffer: state.monitorPage.drawActive.polygonBuffer,
  featureBufferPolygon: getMonitorPageState(state).filters.data.featureBufferPolygon,
});

const mapDispatchToProps = (dispatch) => ({
  monitorPageTogglePolygonBufferActive: () => ( // включить режим рисования полигона (буфера)
    dispatch(
      monitorPageTogglePolygonBufferActive(),
    )
  ),
  monitorPageFalsePolygonBufferActive: () => ( // отключить режим рисования полигона (буфера)
    dispatch(
      monitorPageFalsePolygonBufferActive(),
    )
  ),
  monitorPageChangeFilter: (type, value) => ( // изменение фильтра в сторе
    dispatch(
      monitorPageChangeFilter(type, value),
    )
  ),
});

export default compose<any, any>(
  withLayerProps({
    map: true,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(LayerPolygonBuffer);
