import * as React from 'react';
import {
  PropsOverlay,
  StateOverlay,
} from 'components/map/new/overlay/Overlay.h';
import {
  makeOverlay,
  hideOverlay,
} from 'components/map/new/overlay/utils';
import { createPortal } from 'react-dom';

import {
  OverlayInsideContainer,
  EtsOverlayContainer,
  EtsOverlayTitleContainer,
  OverlayCloseContainer,
  EtsOverlayBodyContainer,
  EtsTriangleWrapContainer,
  EtsTriangleContainer,
} from 'components/map/new/overlay/styled/styled';
import {
  DivNone,
} from 'global-styled/global-styled';

class Overlay extends React.Component<PropsOverlay, StateOverlay> {
  node: any;

  constructor(props) {
    super(props);
    const container = document.createElement('div');
    
    this.state = {
      marker: null,
      container,
    }
  }
  componentDidMount() {
    try {
      const marker = makeOverlay({
        position: this.props.coordsMsk,
        positioning: 'bottom-center',
        element: this.state.container,
        stopEvent: false
      });
      this.props.map.addOverlay(marker);

      this.setState({ marker });
    } catch (e) {
      console.warn('не могу создать попап');
    }
  }

  componentDidUpdate(prevProps) {
    const { coordsMsk } = this.props;

    if (coordsMsk !== prevProps.coordsMsk) {
      let marker = this.state.marker;

      this.state.marker.setPosition(coordsMsk);
      this.props.map.addOverlay(marker);

      this.setState({
        marker,
      });
    }
  }

  componentWillUnmount() {
    try {
      hideOverlay(this.state.marker, this.props.map);
    } catch (e) {
      console.warn('не могу скрыть попап');
    }
  }

  hidePopup: React.MouseEventHandler<HTMLElement> = (e) => {
    try {
      hideOverlay(this.state.marker, this.props.map);
    } catch (e) {
      console.warn('не могу скрыть попап');
    }
    this.props.hidePopup();
  }

  render() {
    const {
      OverlayInside = OverlayInsideContainer,
      EtsOverlay = EtsOverlayContainer,
      EtsOverlayTitle = EtsOverlayTitleContainer,
      OverlayClose = OverlayCloseContainer,
      EtsOverlayBody = EtsOverlayBodyContainer,
      EtsTriangleWrap = EtsTriangleWrapContainer,
      EtsTriangle = EtsTriangleContainer,
      title,
      children,
      ...props
    } = this.props;

    return createPortal(
      <OverlayInside { ...props } >
        <EtsOverlay { ...props }>
          <EtsOverlayTitle { ...props }>
            {title}
            {
              this.props.hidePopup ?
                <OverlayClose { ...props } onClick={this.hidePopup}>x</OverlayClose>
              :
                <DivNone />
            }
          </EtsOverlayTitle>
          <EtsOverlayBody { ...props } >
            {
              children
            }
          </EtsOverlayBody>
        </EtsOverlay>
        <EtsTriangleWrap { ...props } >
          <EtsTriangle { ...props } ></EtsTriangle>
        </EtsTriangleWrap>
      </OverlayInside>,
      this.state.container,
    );
  }
}

export default Overlay;
