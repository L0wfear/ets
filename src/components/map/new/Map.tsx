import * as React from 'react';
import { connect } from 'react-redux';
import { defaultZoom } from 'utils/ol';
import { PROJECTION, ArcGisLayer } from '../MskAdapter.js';

type TypeEventHandles = {
  [key: string]: ol.Object | ol.Object[];
}

type StateMap = {
  map: ol.Map,
  eventHandles: TypeEventHandles | void,
  center: [number, number];
  zoom: number,

  centerOn: Function;
  enableInteractions: boolean;
};

type PropsMap = {
  center: [number, number];
  zoom: number,
  children(props: StateMap): JSX.Element,
  disabledCenterOn?: boolean;
  disabledMousePointerMove?: boolean;
  disabledMouseSingleClick?: boolean;
  disabledMouseMoveend?: boolean;
};

class Map extends React.Component<PropsMap, StateMap> {
  _container: HTMLDivElement;

  constructor(props) {
    super(props);

    const {
      center,
      zoom,
    } = props;

    const initialView = new ol.View({
      center,
      zoom,
      minZoom: 2,
      maxZoom: 13,
      projection: PROJECTION,
      extent: PROJECTION.getExtent(),
    });

    const map = new ol.Map({
      view: initialView,
      controls: [defaultZoom],
      layers: [ArcGisLayer],
      loadTilesWhileAnimating: true,
    });

    this.state = {
      map,
      eventHandles: null,
      zoom,
      center,
      centerOn: this.centerOn,
      enableInteractions: true,
    };
  }

  componentDidMount() {
    this.state.map.setTarget(this._container);
    const eventHandles = {
      pointermove: this.state.map.on('pointermove', this.mousePointerMove),
      singleclick: this.state.map.on('singleclick', this.mouseSingleClick),
      moveend: this.state.map.on('moveend', this.mouseMoveend),
    }
    //unByKey

    this.setState({ eventHandles });
  }

  componentWillReceiveProps(nextProps) {
    const { enableInteractions } = nextProps;

    if (enableInteractions !== this.state.enableInteractions) {
      if (enableInteractions) {
        this.state.map.getInteractions().forEach((interaction) => {
          interaction.setActive(true);
        });
      } else {
        this.state.map.getInteractions().forEach((interaction) => {
          interaction.setActive(false);
        });
      }

      this.setState({ enableInteractions });
    }
    
  }

  mousePointerMove = e => {
    if (this.state.enableInteractions) {
      var pixel = this.state.map.getEventPixel(e.originalEvent);
      var hit = this.state.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return !feature.get('notSelected');
      });

      const el = this.state.map.getViewport() as any;
      el.style.cursor = hit ? 'pointer' : '';
    }
  }

  mouseSingleClick = (event) => {
    if (this.state.enableInteractions) {
      this.state.map.forEachFeatureAtPixel(
        event.pixel,
        (feature, layer) => {
          if (layer.get('singleclick')) {
            layer.get('singleclick')(feature);

            return true;
          }

          return false;
        }
      );
    }
  }

  mouseMoveend = (event) => {
    const zoom = event.map.getView().getZoom();
    const center = event.map.getView().getCenter();

    this.setState({ zoom, center });
    console.info(`Центр карты: [${center}], зум: ${zoom}`);
  }

  centerOn = ({ extent, opt_options = { padding: [50, 550, 50, 150], maxZoom: 11, duration: 500 }, noCheckDisabledCenterOn = false }) => {
    if (noCheckDisabledCenterOn ? true : !this.props.disabledCenterOn) {
      this.state.map.getView().fit(extent, opt_options);
      return true;
    }

    return false;
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
