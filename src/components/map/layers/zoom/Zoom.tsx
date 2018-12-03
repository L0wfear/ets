import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import withLayerProps from 'components/map/layers/base-hoc/layer/LayerProps';

import {
  ButtonContainer,
} from 'components/monitor/layers/measure/styled/styled';

type PropsLayerZoom = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  map: ol.Map;
};

class LayerZoom extends React.PureComponent<PropsLayerZoom, {}> {
  componentDidMount() {
    this.props.addLayer({ id: 'Zoom', zIndex: 100 });
  }

  componentWillUnmount() {
    this.props.removeLayer();
  }

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
