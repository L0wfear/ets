import * as React from 'react';

import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerEditDrawRoute,
  StateLayerEditDrawRoute,
} from 'components/route/form/map/layers/layer-edit-draw-route/LayerEditDrawRoute.h';
import {
  renderInputLines,
} from 'components/route/form/map/layers/layer-edit-draw-route/utils';

import { linesState } from 'components/route/form/map/layers/layer-edit-draw-route/feature-style';

class LayerEditDrawRoute extends React.PureComponent<PropsLayerEditDrawRoute, StateLayerEditDrawRoute> {
  componentDidMount() {
    this.props.addLayer({ id: 'LayerEditDrawRoute', zIndex: 0 }).then(() => {
      this.props.setDataInLayer('singleclick', this.singleclick);
      const {
        drawObjectList,
      } = this.props;

      if (drawObjectList && drawObjectList.length) {
        renderInputLines(drawObjectList, this.props);
      } else {
        this.props.removeFeaturesFromSource(null, true);
      }
    });
  }

  componentDidUpdate(prevProps) {
    this.props.removeFeaturesFromSource(null, true);
    const {
      drawObjectList,
    } = this.props;

    if (prevProps.drawObjectList !== drawObjectList) {
      if (drawObjectList && drawObjectList.length) {
        renderInputLines(drawObjectList, this.props);
      } else {
        this.props.removeFeaturesFromSource(null, true);
      }
    }
  }

  singleclick = (feature) => {
    const id = feature.getId();
    const index = this.props.drawObjectList.findIndex(({ object_id }) => object_id === id);
    const objData = this.props.drawObjectList[index];

    if (objData) {
      this.props.handleDrawFeatureClick({
        ...objData,
        index,
        state: objData.state === linesState.SELECTED
        ? linesState.SELECTED_IDLING
        : linesState.SELECTED,
      });
    }
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}


export default withLayerProps({})(LayerEditDrawRoute);
