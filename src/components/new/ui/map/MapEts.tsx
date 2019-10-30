import * as React from 'react';
import { connect } from 'react-redux';
import {
  PropsMapEts,
  StateMapEts,
} from 'components/new/ui/map/MapEts.h';

import {
  getMap,
  triggerFuncOnNewPRopsInMapEts,
  mousePointerMove,
  mouseSingleClick,
  centerOn,
} from 'components/new/ui/map/utils';

const cacheTimeout = {};

/**
 * @todo свои кнопки зума на styled-components чтобы убрать импорт css
 */
class MapEts extends React.PureComponent<PropsMapEts, StateMapEts> {
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
    const { rotationAngle } = this.props;
    this.state.map.setTarget(this._container);

    this.state.map.on('pointermove', this.mousePointerMove);
    this.state.map.on('singleclick', this.mouseSingleClick);
    this.state.map.on('movestart', this.mouseMovestart);
    this.state.map.on('moveend', this.mouseMoveend);
    this.props.setMapToContext(this.props.mapKey, this.state.map);
    if (rotationAngle) {
      this.state.map.getView().setRotation(rotationAngle);
    }
  }

  static getDerivedStateFromProps(nextProps: PropsMapEts, prevState: StateMapEts) {
    const {
      hasChange,
      newChnagedStateObj,
    } = triggerFuncOnNewPRopsInMapEts(nextProps, prevState);

    if (hasChange) {
      return newChnagedStateObj;
    }

    return null;
  }

  componentWillUnmount() {
    this.props.removeMapToContext(this.props.mapKey);
  }

  mousePointerMove = (olEvent) => {
    if (olEvent.dragging) {
      return;
    }

    if (cacheTimeout[this.props.mapKey]) {
      clearTimeout(cacheTimeout[this.props.mapKey]);
      this.state.map.getViewport().classList.remove('pointer');
    }

    cacheTimeout[this.props.mapKey] = setTimeout(
      () => {
        mousePointerMove(
          olEvent,
          this.state.enableInteractions && !this.props.disabledMouseSingleClick,
        );
        clearTimeout(cacheTimeout[this.props.mapKey]);
      },
      200,
    );
  }

  mouseSingleClick = (olEvent) => {
    mouseSingleClick(
      olEvent,
      this.state.enableInteractions && !this.props.disabledMouseSingleClick,
    );
  }

  mouseMovestart = () => {
    this.state.map.getViewport().classList.remove('pointer');
  }

  mouseMoveend = (event) => {
    const zoom = event.map.getView().getZoom();
    const center = event.map.getView().getCenter();

    this.setState({ zoom, center });
    // tslint:disable-next-line
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
  setContainer = (node) => this._container = node;

  render() {
    return (
      <div className="olmap">
        <div ref={this.setContainer} className="openlayers-container" />
        { this.props.children(this.state) }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.session.userData,
  zoom: state.session.userData.map_config.zoom || 6,
  center: state.session.userData.map_config.coordinates || [0, 0],
});

export default connect(
  mapStateToProps,
)(MapEts);
