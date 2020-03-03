import * as React from 'react';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  PropsLayerEditDrawRoute,
  StateLayerEditDrawRoute,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-draw-route/LayerEditDrawRoute.h';
import {
  renderInputLines,
} from 'components/new/pages/routes_list/form/inside_fields/creating-map/map/layers/layer-edit-draw-route/utils';

import { linesState } from 'constants/polygons';

class LayerEditDrawRoute extends React.PureComponent<PropsLayerEditDrawRoute, StateLayerEditDrawRoute> {
  componentDidMount() {
    this.props.addLayer({ id: 'LayerEditDrawRoute', zIndex: 10 }).then(() => {
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
  };

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
