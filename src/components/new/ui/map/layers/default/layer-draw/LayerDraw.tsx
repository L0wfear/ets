import * as React from 'react';
import Feature from 'ol/Feature';
import olInteractionDoubleClickZoom from 'ol/interaction/DoubleClickZoom';
import Map from 'ol/Map';
import Style from 'ol/style/Style';
import Draw from 'ol/interaction/Draw';

import { isFunction } from 'util';

import olInteractionDraw from 'ol/interaction/Draw';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

type PropsLayerLayerDraw = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  getVectorSource: ETSCore.Map.InjectetLayerProps.FuncGetVectorSource,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  map: Map;
  initCallback?: any;

  inDraw: boolean;
  type: any;
  handleEndDraw: any;
  handleStartDraw?: any;

  styles: Style | Style[];
};

type StateLayerLayerDraw = {
  interactionDraw: Draw | void;
  activeDraw: boolean;
};

/**
 * @todo подстроиться по LayerParkingPoints
 */
class LayerLayerDraw extends React.Component<PropsLayerLayerDraw, StateLayerLayerDraw> {
  state = {
    interactionDraw: null,
    activeDraw: false,
  };

  componentDidMount() {
    this.props.addLayer({ id: 'MeasureLines', zIndex: 100 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

      const { initCallback } = this.props;

      if (isFunction(initCallback)) {
        initCallback();
      }

      if (this.props.inDraw) {
        this.letsDraw();
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { inDraw } = this.props;
    if (prevProps.inDraw !== this.props.inDraw) {
      if (inDraw) {
        this.letsDraw();
      } else {
        this.endDraw();
      }
    }
  }

  componentWillUnmount() {
    this.endDraw();
    this.props.removeLayer();
  }

  letsDraw() {
    const interactionDraw = new olInteractionDraw({
      source: this.props.getVectorSource(),
      type: this.props.type,
      style: this.props.styles,
    });

    this.props.map.getInteractions().forEach((interaction) => {
      if (interaction instanceof olInteractionDoubleClickZoom) {
        this.props.map.removeInteraction(interaction);
      }
    });
    interactionDraw.on('drawstart', () => {
      if (isFunction(this.props.handleStartDraw)) {
        this.props.handleStartDraw();
      }
    });

    interactionDraw.on('drawend', (event: any) => {
      const feature: Feature = event.feature;

      const geometry = feature.getGeometry();
      const type = geometry.getType();

      /**
       * @todo определить для всех типо
       */
      if (type === 'LineString') {
        const linesArr = [];

        /**
         * ol 4.6.5 мутирует аргументы
         */
        (geometry as any).forEachSegment(([...start], [...end]) => {
          linesArr.push([start, end]);
        });

        this.props.handleEndDraw(
          (geometry as any).getCoordinates(),
          (geometry as any).getLength(),
          geometry.getType(),
          linesArr,
        );
      }
      if (type === 'Point') {
        const coordinates = (geometry as any).getCoordinates();

        /**
         * ol 4.6.5 мутирует аргументы
         */
        this.props.handleEndDraw(
          coordinates,
          0,
          geometry.getType(),
          coordinates,
        );
      }
      if (type === 'Polygon') {
        const coordinates = (geometry as any).getCoordinates();

        /**
         * ol 4.6.5 мутирует аргументы
         */
        this.props.handleEndDraw(
          feature.clone(),
          geometry.getType(),
          coordinates,
        );
      }

      feature.setGeometry(null);
    });

    this.props.map.addInteraction(interactionDraw);
    this.setState({ interactionDraw });
  }

  endDraw() {
    this.props.map.removeInteraction(this.state.interactionDraw);
    this.setState({ interactionDraw: null });
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default withLayerProps({
  map: true,
})(LayerLayerDraw);
