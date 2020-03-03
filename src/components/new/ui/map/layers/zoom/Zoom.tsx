import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import Map from 'ol/Map';

import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';
import { ButtonContainer } from 'components/old/monitor/layers/polygon_buffer/styled/styled';

type PropsLayerZoom = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer;
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer;
  map: Map;
};

class LayerZoom extends React.PureComponent<PropsLayerZoom, {}> {
  handleClickInc = () => {
    const { map } = this.props;

    map.getView().setZoom(map.getView().getZoom() + 1);
  };

  handleClickDec = () => {
    const { map } = this.props;

    map.getView().setZoom(map.getView().getZoom() - 1);
  };

  render() {
    return (
      <ButtonContainer>
        <EtsBootstrap.Button onClick={this.handleClickInc}>+</EtsBootstrap.Button>
        <EtsBootstrap.Button onClick={this.handleClickDec}>-</EtsBootstrap.Button>
      </ButtonContainer>
    );
  }
}

export default withLayerProps({
  map: true,
})(LayerZoom);
