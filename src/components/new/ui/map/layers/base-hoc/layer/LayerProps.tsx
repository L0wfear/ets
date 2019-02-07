import * as React from 'react';
import sourceVector from 'ol/source/Vector';
import layerVector from 'ol/layer/Vector';

type PropsLayerProps = {
  map: ol.Map;
  center?: [number, number];
  zoom?: number,
  centerOn?: any;
  [key: string]: any;
};

type StateLayerProps = {
  vectorSource: ol.source.Vector | null;
  olLayer: ol.layer.Vector | null;
};

type TypeConfig = {
  zoom?: boolean;
  centerOn?: boolean,
  map?: boolean;
};

const withLayerProps = (config: TypeConfig = {}) => (Component) => (
  class LayerProps extends React.PureComponent<PropsLayerProps, StateLayerProps> {
    state: StateLayerProps = {
      vectorSource: null,
      olLayer: null,
    };

    addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer = ({ id = Math.random(), zIndex, renderMode = 'vector' }) => {
      return new Promise((res) => {
        const vectorSource = new sourceVector();

        const olLayer = new layerVector({
          source: vectorSource,
          renderMode,
        });

        // Определяет, что это не слой с картой
        olLayer.set('notMap', true);
        olLayer.set('id', id);
        if (zIndex) {
          olLayer.setZIndex(zIndex);
        }

        this.props.map.addLayer(olLayer);
        this.setState({ vectorSource, olLayer }, () => res(id));
      });
    }
    removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer = () => {
      return new Promise((res) => {
        const { olLayer } = this.state;
        if (olLayer) {
          this.props.map.removeLayer(olLayer);
          this.setState({ olLayer: null, vectorSource: null }, res);
        }
      });
    }

    getVectorSource: ETSCore.Map.InjectetLayerProps.FuncGetVectorSource = () => this.state.vectorSource;
    getOlLayer: ETSCore.Map.InjectetLayerProps.FuncGetOlLayer = () => this.state.olLayer;

    addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource = (features) => {
      const { vectorSource } = this.state;
      if (vectorSource) {
        const featureArr = Array.isArray(features) ? features : [features];
        featureArr.forEach((feature) => (
          this.state.vectorSource.addFeature(feature)
        ));
      }
    }
    getFeatureById: ETSCore.Map.InjectetLayerProps.FuncGetFeatureById = (id) => {
      return this.state.vectorSource.getFeatureById(id);
    }

    removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource = (features, all) => {
      const { vectorSource } = this.state;
      if (vectorSource) {
        if (all) {
          vectorSource.clear();
        } else {
          const featureArr: ol.Feature[] = Array.isArray(features) ? features : [features as ol.Feature];
          try {
            featureArr.forEach((feature) => this.state.vectorSource.removeFeature(feature));
          } catch (e) {
          // tslint:disable-next-line
            console.error(e);
          }
        }
      }
    }

    setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer = (name, value) => {
      if (this.state.olLayer) {
        this.state.olLayer.set(name, value);
      }
    }

    getAllFeatures: ETSCore.Map.InjectetLayerProps.FuncGetAllFeatures = () => (
      this.state.vectorSource.getFeatures()
    )

    render() {
      const { map, zoom, center, centerOn, ...props } = this.props;
      return (
        <Component
          addLayer={this.addLayer}
          getOlLayer={this.getOlLayer}
          removeLayer={this.removeLayer}
          getVectorSource={this.getVectorSource}
          addFeaturesToSource={this.addFeaturesToSource}
          removeFeaturesFromSource={this.removeFeaturesFromSource}
          getFeatureById={this.getFeatureById}
          setDataInLayer={this.setDataInLayer}
          getAllFeatures={this.getAllFeatures}
          zoom={config.zoom ? zoom : undefined}
          map={config.map ? map : undefined}
          centerOn={config.centerOn ? centerOn : undefined}
          { ...props }
          />
      );
    }
  }
);

export default withLayerProps;
