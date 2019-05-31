import * as React from 'react';
import Map from 'ol/Map';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import withLayerProps from 'components/new/ui/map/layers/base-hoc/layer/LayerProps';

import {
  ButtonContainer,
} from 'components/monitor/layers/measure/styled/styled';

type PropsLayerZoom = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  map: Map;
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
            <Button onClick={this.handleClickInc}>+</Button>
            <Button onClick={this.handleClickDec}>-</Button>
          </ButtonGroup>
        </ButtonContainer>
      </div>
    );
  }
}

export default withLayerProps({
  map: true,
})(LayerZoom);
