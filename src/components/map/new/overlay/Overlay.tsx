import * as React from 'react';
import cx from 'classnames';

class Overlay extends React.Component<any, any> {
  _handlers: any;
  node: any;

  constructor(props) {
    super(props);

    this.state = {
      coords_msk: props.coords_msk,
      marker: null,
    }
  }
  componentDidMount() {
    const marker = new ol.Overlay({
      position: this.props.coords_msk,
      positioning: 'bottom-center',
      element: this.node,
      stopEvent: false
    });
    (this.props.map as ol.Map).addOverlay(marker);

    this.setState({ marker })
  }
  componentWillReceiveProps(nextProps) {
    const { coords_msk } = nextProps;
    if (coords_msk !== this.state.coords_msk) {
      (this.state.marker as ol.Overlay).setPosition(coords_msk)
      this.setState({
        coords_msk,
      });
    }
  }

  componentWillUnmount() {
    this.state.marker.setPosition([-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]);
  }

  hidePopup = () => {
    this.state.marker.setPosition([-Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER]);

    this.props.hidePopup();
  }

  getNode = (node) => this.node = node;

  render() {
    return (
      <div ref={this.getNode} className={cx('overlay_inside', this.props.className)}>
        <div className="ets_overlay" >
          <div className="ets_overlay-title">
            {this.props.title}
            <div className="overlay_close"onClick={this.hidePopup}>x</div>
          </div>
          <div className="ets_overlay-body" >
            {this.props.children}
          </div>
        </div>
        <div className="ets_triangle-wrap">
          <div className="ets_triangle"></div>
        </div>
      </div>
    )
  }
}

export default Overlay;
