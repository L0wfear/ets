import * as React from 'react';
import * as cx from 'classnames';
import {
  PropsOverlay,
  StateOverlay,
} from 'components/map/new/overlay/Overlay.h';
import {
  hideOverlay,
  makeOverlay,
} from 'components/map/new/overlay/utils';

class Overlay extends React.Component<PropsOverlay, StateOverlay> {
  node: any;

  constructor(props) {
    super(props);

    this.state = {
      coords_msk: props.coords_msk,
      marker: null,
    }
  }
  componentDidMount() {
    try {
      const marker = makeOverlay({
        position: this.props.coords_msk,
        positioning: 'bottom-center',
        element: this.node,
        stopEvent: false
      });
      this.props.map.addOverlay(marker);

      this.setState({ marker });
    } catch (e) {
      console.warn('не могу создать попап');
    }
  }
  componentWillReceiveProps(nextProps) {
    const { coords_msk } = nextProps;
    if (coords_msk !== this.state.coords_msk) {
      try {
        this.state.marker.setPosition(coords_msk);
        this.setState({ coords_msk });
      } catch (e) {
        console.warn('не могу свдинуть попап');
      }
    }
  }

  componentWillUnmount() {
    try {
      hideOverlay(this.state.marker);
    } catch (e) {
      console.warn('не могу скрыть попап');
    }
  }

  hidePopup = () => {
    try {
      hideOverlay(this.state.marker);
    } catch (e) {
      console.warn('не могу скрыть попап');
    }

    this.props.hidePopup();
  }

  getNode = (node) => this.node = node;

  render() {
    return (
      <div ref={this.getNode} className={cx('overlay_inside', this.props.className)}>
        <div className="ets_overlay" >
          <div className="ets_overlay-title">
            {this.props.title}
            {
              this.props.hidePopup ?
                <div className="overlay_close"onClick={this.hidePopup}>x</div>
              :
                <div className="none"></div>
            }
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
