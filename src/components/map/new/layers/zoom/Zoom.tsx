import * as React from 'react';
import * as Button from 'react-bootstrap/lib/Button';
import * as ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import withLayerProps from 'components/map/new/layers/base-hoc/layer/LayerProps';

type PropsLayerZoom = {
  addLayer: ETSCore.Map.InjectetLayerProps.FuncAddLayer,
  removeLayer: ETSCore.Map.InjectetLayerProps.FuncRemoveLayer,
  map: ol.Map;
};

class LayerZoom extends React.Component<PropsLayerZoom, {}> {
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
        <div className="ol-control ol-measure-new">
          <ButtonGroup vertical>
            <Button onClick={this.handleClickInc}>+</Button>
            <Button onClick={this.handleClickDec}>-</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default withLayerProps({
  map: true,
})(LayerZoom);
