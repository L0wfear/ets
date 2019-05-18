import * as React from 'react';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  ButtonContainer,
} from 'components/monitor/layers/measure/styled/styled';

type PropsLayerZoom = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  map: ol.Map;
};

class LayerZoom extends React.PureComponent<PropsLayerZoom, {}> {
  handleClickInc = () => {
    const { map } = this.props;

    map.getView().setZoom(map.getView().getZoom() + 1);
  }

  handleClickDec = () => {
    const { map } = this.props;

    map.getView().setZoom(map.getView().getZoom() - 1);
  }

  render() {
    return (
      <div>
        <ButtonContainer>
          <ButtonGroup vertical>
            <EtsBootstrap.Button onClick={this.handleClickInc}>+</EtsBootstrap.Button>
            <EtsBootstrap.Button onClick={this.handleClickDec}>-</EtsBootstrap.Button>
          </ButtonGroup>
        </ButtonContainer>
      </div>
    );
  }
}

export default withLayerProps({
  map: true,
})(LayerZoom);
