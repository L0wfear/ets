import * as React from 'react';
import { connect } from 'react-redux';
import {
  PropsMap,
  StateMap,
} from 'components/map/new/Map.h';

import {
  getMap,
  triggerFuncOnComponentWillReceiveProps,
  mousePointerMove,
  mouseSingleClick,
  centerOn,
} from 'components/map/new/utils';
class Map extends React.Component<PropsMap, StateMap> {
  _container: HTMLDivElement;

  constructor(props) {
    super(props);

    const {
      center,
      zoom,
    } = props;

    const map = getMap(center, zoom);

    this.state = {
      map,
      zoom,
      center,
      centerOn: this.centerOn,
      enableInteractions: true,
    };
  }

  componentDidMount() {
    this.state.map.setTarget(this._container);

    this.state.map.on('pointermove', this.mousePointerMove);
    this.state.map.on('singleclick', this.mouseSingleClick);
    this.state.map.on('moveend', this.mouseMoveend);
  }

  componentWillReceiveProps(nextProps) {
    const {
      hasChange,
      newChnagedStateObj,
    } = triggerFuncOnComponentWillReceiveProps(nextProps, this.state);

    if (hasChange) {
      this.setState(newChnagedStateObj);
    }
  }

  mousePointerMove = (olEvent) => {
    mousePointerMove(
      olEvent,
      this.state.enableInteractions,
    );
  }

  mouseSingleClick = (olEvent) => {
    mouseSingleClick(
      olEvent,
      this.state.enableInteractions,
    );
  }

  mouseMoveend = (event) => {
    const zoom = event.map.getView().getZoom();
    const center = event.map.getView().getCenter();

    this.setState({ zoom, center });
    console.info(`Центр карты: [${center}], зум: ${zoom}`);
  }

  centerOn = (fitProps, noCheckDisabledCenterOn = false) => {
    return centerOn(
      this.state.map,
      this.props.disabledCenterOn,
      fitProps,
      noCheckDisabledCenterOn,
    );
  }
  setContainer = node => this._container = node;

  render() {
    return (
      <div className="olmap">
        <div ref={this.setContainer} className="openlayers-container" />
        { this.props.children(this.state) }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  userData: state.session.userData,
  zoom: state.session.userData.map_config.zoom || 6,
  center: state.session.userData.map_config.coordinates || [0, 0],
});

export default connect(
  mapStateToProps,
)(Map);
