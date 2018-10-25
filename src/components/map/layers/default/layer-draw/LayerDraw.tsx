import * as React from 'react';
import olInteractionDraw from 'ol/interaction/Draw';
import olInteractionDoubleClickZoom from'ol/interaction/DoubleClickZoom';
import Feature from 'ol/Feature';

import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';

type PropsLayerLayerDraw = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  getVectorSource: ETSCore.Map.InjectetLayerProps.FuncGetVectorSource,
  addFeaturesToSource: ETSCore.Map.InjectetLayerProps.FuncAddFeaturesToSource,
  removeFeaturesFromSource: ETSCore.Map.InjectetLayerProps.FuncRemoveFeaturesFromSource,
  setDataInLayer: ETSCore.Map.InjectetLayerProps.FuncSetDataInLayer,
  map: ol.Map;

  inDraw: boolean;
  type: 'LineString' | 'Point',
  handleEndDraw: any;

  styles: ol.style.Style | ol.style.Style[];
};

type OneLine = {
  length: number;
  points: any[];
}

type StateLayerLayerDraw = {
  lines: OneLine[];
  interactionDraw: ol.interaction.Draw | void;
  activeDraw: boolean;
};


/**
 * @todo подстроиться по LayerParkingPoints
 */
class LayerLayerDraw extends React.Component<PropsLayerLayerDraw, StateLayerLayerDraw> {
  state = {
    lines: [],
    interactionDraw: null,
    activeDraw: false,
  }
  componentDidMount() {
    this.props.addLayer({ id: 'MeasureLines', zIndex: 100 }).then(() => {
      this.props.setDataInLayer('singleclick', undefined);

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
        })

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

      feature.setGeometry(null)
    });

    this.props.map.addInteraction(interactionDraw);
    this.setState({ interactionDraw });
  }

  endDraw() {
    this.props.map.removeInteraction(this.state.interactionDraw)
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
